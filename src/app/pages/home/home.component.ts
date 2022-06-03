import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';
import { ThemeService } from '@app/services/theme/theme.service';
import {ApiService} from "@app/services/api/api.service";
import {ExplorerSummaryDto} from "@app/types/dto";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnDestroy {
    showHint: boolean;
    navigation$;
    value: string;

    marketCap = '$XX,XXX,XX';

    // @ts-ignore
    summaryData = {
        knownAccountsCount: 'XXX',
        circulatingCount: 'X,XXX,XXX,XXX',
        devFundCount: 'XXX,XXX,XXX',
        totalPrincipalRepsCount: 'XX',
        representativesOnlineCount: 'XX',
        principalRepsOnlineCount: 'XX',
        confirmedTransactionsCount: 'XXX,XXX,XXX',
        ledgerSizeMB: 'XX.XX',
        ledgerDatabaseType: '',
        bananoPriceUsd: 'X.XX'
    } as ExplorerSummaryDto;

    constructor(
        public vp: ViewportService,
        private readonly _themeService: ThemeService,
        private readonly _searchService: SearchService,
        private readonly _util: UtilService,
        private readonly _router: Router,
        private readonly _api: ApiService,
    ) {}

    ngOnInit(): void {
        this._api.fetchExplorerSummaryData().then((data) => {
            Object.assign(this.summaryData, data);
            if (data.ledgerSizeMB) {
                data.ledgerSizeMB = data.ledgerSizeMB / 1024;
            }
            if (data.bananoPriceUsd) {
                const circulatingMarketValue = Number(data.bananoPriceUsd) * Number(data.circulatingCount);
                this.marketCap = `$${this._util.numberWithCommas(circulatingMarketValue.toFixed(0))}`;
                this.summaryData.bananoPriceUsd = data.bananoPriceUsd.toFixed(4) as any;
            }
        }).catch((err) => {
            console.error(err);
        })
    }

    ngOnDestroy(): void {
        if (this.navigation$) {
            this.navigation$.unsubscribe();
        }
    }

    search(searchValue: string, e: MouseEvent): void {
        if (this.isSearchDisabled()) {
            this.showHint = true;
            return;
        }
        this._searchService.emitSearch(searchValue, e.ctrlKey);
    }

    isDarkTheme(): boolean {
        return this._themeService.isDarkMode();
    }

    isSearchDisabled(): boolean {
        return !this._searchService.isValidAddress(this.value) && !this._searchService.isValidBlock(this.value);
    }
}
