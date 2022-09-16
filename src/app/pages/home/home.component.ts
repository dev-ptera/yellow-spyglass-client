import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';
import { ThemeService } from '@app/services/theme/theme.service';
import { ApiService } from '@app/services/api/api.service';
import { DiscordResponseDto, ExplorerSummaryDto } from '@app/types/dto';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnDestroy {
    showHint: boolean;
    navigation$;
    userInput = '';
    routes = APP_NAV_ITEMS;

    marketCap = '$xx,xxx,xx';

    // @ts-ignore
    summaryData = {
        knownAccountsCount: 'xxx',
        circulatingCount: 'x,xxx,xxx,xxx',
        devFundCount: 'xxx,xxx,xxx',
        totalPrincipalRepsCount: 'xx',
        representativesOnlineCount: 'xx',
        principalRepsOnlineCount: 'xx',
        confirmedTransactionsCount: 'xxx,xxx,xxx',
        ledgerSizeMB: 'xx.xx',
        ledgerDatabaseType: '',
        bananoPriceUsd: 'x.xx',
    } as ExplorerSummaryDto;

    constructor(
        public vp: ViewportService,
        private readonly _themeService: ThemeService,
        private readonly _searchService: SearchService,
        private readonly _util: UtilService,
        private readonly _router: Router,
        private readonly _api: ApiService
    ) {}

    ngOnInit(): void {
        this._api
            .fetchExplorerSummaryData()
            .then((data) => {
                Object.assign(this.summaryData, data);
                if (data.ledgerSizeMB) {
                    this.summaryData.ledgerSizeMB = Number((data.ledgerSizeMB / 1024).toFixed(1));
                }
                if (data.bananoPriceUsd) {
                    const circulatingMarketValue = Number(data.bananoPriceUsd) * Number(data.circulatingCount);
                    this.marketCap = `$${this._util.numberWithCommas(circulatingMarketValue.toFixed(0))}`;
                    this.summaryData.bananoPriceUsd = data.bananoPriceUsd.toFixed(4) as any;
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    ngOnDestroy(): void {
        if (this.navigation$) {
            this.navigation$.unsubscribe();
        }
    }

    search(searchValue: string, mouseEvent?: MouseEvent): void {
        const ctrl = mouseEvent?.ctrlKey;

        const trimmed = searchValue.trim();

        // BRPD feature only - given a user id, searches their address.
        if (environment.brpd && this.isSearchDisabled() && trimmed.length === 18) {
            this._api
                .fetchDiscordWalletFromUserId(trimmed)
                .then((data: DiscordResponseDto[]) => {
                    this._searchService.emitSearch(data[0].address, ctrl);
                })
                .catch((err) => {
                    console.error(err);
                });
            return;
        }

        if (this.isSearchDisabled()) {
            this.showHint = true;
            return;
        }

        this._searchService.emitSearch(trimmed, ctrl);
    }

    isDarkTheme(): boolean {
        return this._themeService.isDarkMode();
    }

    /** Returns false if userInput is both an invalid hash & an invalid address. */
    isSearchDisabled(): boolean {
        const trimmed = this.userInput.trim();
        return !this._searchService.isValidAddress(trimmed) && !this._searchService.isValidBlock(trimmed);
    }
}
