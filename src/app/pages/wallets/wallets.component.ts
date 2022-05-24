import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';
import { ApiService } from '@app/services/api/api.service';
import { Options } from 'highcharts';
// eslint-disable-next-line no-duplicate-imports
import * as Highcharts from 'highcharts';
import { UtilService } from '@app/services/util/util.service';
import { PriceService } from '@app/services/price/price.service';
import { AccountBalanceDto, AccountDistributionStatsDto } from '@app/types/dto';
import { OnlineRepsService } from '@app/services/online-reps/online-reps.service';
import { AliasService } from '@app/services/alias/alias.service';

@Component({
    selector: 'app-wallets',
    templateUrl: 'wallets.component.html',
    styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit {
    currentPage = 0;
    readonly pageSize = 25;

    isLoading = true;
    hasError = false;
    totalAccounts: number;
    loadingNewAccountBalancePage = false;

    distributionChart: Options;
    columns = ['position', 'addr', 'ban'];
    accountBalances: AccountBalanceDto[] = [];
    Highcharts: typeof Highcharts = Highcharts;

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public searchService: SearchService,
        public aliasService: AliasService,
        private readonly _api: ApiService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _priceService: PriceService,
        private readonly _onlineRepsService: OnlineRepsService
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        Promise.all([this._api.fetchDistributionStats(), this._api.fetchRichListSegment(0, this.pageSize)])
            .then((data) => {
                this.distributionChart = this._createDistributionChart(data[0]);
                this.accountBalances = data[1];
                this.totalAccounts = data[0].totalAccounts;
                this.isLoading = false;
            })
            .catch((err) => {
                this.hasError = true;
                console.error(err);
            });
    }

    loadRichListPage(currPage: number): void {
        this.currentPage = currPage;
        this.loadingNewAccountBalancePage = true;
        const offset = currPage * this.pageSize;
        this._api
            .fetchRichListSegment(offset, this.pageSize)
            .then((data) => {
                this.accountBalances = data;
                this.loadingNewAccountBalancePage = false;
            })
            .catch((err) => {
                console.error(err);
                this.loadingNewAccountBalancePage = false;
            });
    }

    formatIndex(i: number): string {
        return this.util.numberWithCommas(i);
    }

    formatBanAmount(ban: number): string {
        return `${this.util.numberWithCommas(ban.toFixed(ban > 10000 ? 0 : 3))} `;
    }

    formatUsdPrice(ban: number): number {
        return Math.round(this._priceService.priceInUSD(ban));
    }

    formatBtcPrice(ban: number): string {
        return `₿${this.util.numberWithCommas(this._priceService.priceInBitcoin(ban).toFixed(2))}`;
    }

    showWarningBadge(rep: string): boolean {
        return this._onlineRepsService.onlineReps.size > 0 && !this._onlineRepsService.onlineReps.has(rep);
    }

    routeRepAddress(address: string, e: MouseEvent): void {
        this.searchService.emitSearch(address, e.ctrlKey);
    }

    formatAccountAddress(address: string): string {
        if (address) {
            const firstBits = address.substring(0, 12);
            const midBits = address.substring(12, 58);
            const lastBits = address.substring(58, 64);
            8;
            return `<strong class="">${firstBits}</strong><span class="secondary">${midBits}</span><strong class="">${lastBits}</strong>`;
        }
    }

    private _createDistributionChart(data: AccountDistributionStatsDto): Options {
        return {
            chart: {
                type: 'column',
                backgroundColor: 'rgba(0,0,0,0)',
            },
            tooltip: {
                enabled: false,
            },
            credits: {
                enabled: false,
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: [
                    '.001 - .01',
                    '.01 - .1',
                    '.1 - 1',
                    '1 - 10',
                    '10 - 100',
                    '100 - 1K',
                    '1K - 10K',
                    '10K - 100K',
                    '100K - 1M',
                    '1M - 10M',
                    '10M - 100M',
                    '100M - 1B',
                ],
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                },
                labels: {
                    enabled: false,
                },
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },
                series: {
                    dataLabels: {
                        enabled: true,
                    },
                },
            },
            series: [
                {
                    name: 'Opened Accounts',
                    type: 'bar',
                    color: '#FBDD11',
                    data: [
                        data.number0_001,
                        data.number0_01,
                        data.number0_1,
                        data.number1,
                        data.number10,
                        data.number100,
                        data.number1_000,
                        data.number10_000,
                        data.number100_000,
                        data.number1_000_000,
                        data.number10_000_000,
                        data.number100_000_000,
                    ],
                    dataLabels: {
                        style: {
                            fontSize: '12px',
                            fontWeight: '400',
                            fontFamily: 'Open Sans',
                            textOutline: 'none',
                        },
                    },
                },
            ],
        };
    }
}
