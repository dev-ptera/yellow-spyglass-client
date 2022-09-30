import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ThemeService } from '@app/services/theme/theme.service';
import { ApiService } from '@app/services/api/api.service';
import { ExplorerSummaryDto } from '@app/types/dto';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';
import { SearchBarComponent } from '../../navigation/search-bar/search-bar.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
    @ViewChild('searchBar') searchBar: SearchBarComponent;

    showHint: boolean;
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
        private readonly _util: UtilService,
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

    isDarkTheme(): boolean {
        return this._themeService.isDarkMode();
    }

    search(e: MouseEvent): void {
        this.searchBar.searchCurrentValue(e.ctrlKey);
    }
}
