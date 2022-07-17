import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { ApiService } from '@app/services/api/api.service';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ThemeService } from '@app/services/theme/theme.service';
import { SearchService } from '@app/services/search/search.service';
import { InsightsTabService } from '@app/pages/account/tabs/insights/insights-tab.service';
import * as Highcharts from 'highcharts';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import HighchartsBoost from 'highcharts/modules/boost';


@Component({
    selector: 'account-insights-tab',
    templateUrl: 'insights-tab.component.html',
    styleUrls: ['insights-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InsightsTabComponent implements OnInit {
    @Input() address: string;
    @Input() blockCount: number;
    @Input() maxInsightsLimit: number;

    navItems = APP_NAV_ITEMS;
    Highcharts: typeof Highcharts = Highcharts;

    blocksLoaded = 0;

    hasError: boolean;
    isLoadingBlock: boolean;
    isLoadingInsights: boolean;
    isInsightsDisabled: boolean;
    isLoadingInsightsWebsocket: boolean;

    insights: InsightsDto;

    constructor(
        public vp: ViewportService,
        private readonly _util: UtilService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _apiService: ApiService,
        private readonly _themeService: ThemeService,
        private readonly _searchService: SearchService,
        private readonly _insightsTabService: InsightsTabService
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        window['plausible']('Insights Generated', {
            props: {
                address: this.address,
                size: this.blockCount,
            },
        });

        this.isInsightsDisabled = this.blockCount > this.maxInsightsLimit || !this.blockCount;

        // Already loaded insights for this account.
        if (this._insightsTabService.shouldLoadInsights()) {
            this.fetchInsights();
        } else {
            this._formatChartData(this._insightsTabService.getInsights());
        }
    }

    /** Called when a user clicks the insights tab for the first time. */
    // TODO: Move me to the service.
    fetchInsights(): void {
        if (this.isLoadingInsights) {
            return;
        }
        if (this.isInsightsDisabled) {
            return;
        }

        this.isLoadingInsights = true;

        /** If there are a large amount of transactions to sift through, use the websockets endpoint. */
        if (this.blockCount > 10_000) {
            this.isLoadingInsightsWebsocket = true;
            this._apiService
                .fetchAccountInsightsWS(this.address)
                .then((ws) => {
                    ws.subscribe((data) => {
                        if (typeof data === 'number') {
                            this.blocksLoaded = data;
                        } else if (data) {
                            this._formatChartData(data);
                        }
                    });
                })
                .catch((err) => {
                    console.error(err);
                });

            /** Otherwise use the POST request. */
        } else {
            this._apiService
                .fetchInsights(this.address)
                .then((data) => {
                    this._formatChartData(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    private _formatChartData(data: InsightsDto): void {
        if (data.heightBalances.length > 100_000) {
            HighchartsBoost(Highcharts);
        }
        this.insights = data;
        this._insightsTabService.setInsights(data);
        this.isLoadingInsights = false;
        this.isLoadingInsightsWebsocket = false;
        const chartData = [];
        for (const key of Object.keys(data.heightBalances)) {
            chartData.push([key, data.heightBalances[key]]);
        }
        this._graphChart(chartData);
    }

    private _graphChart(chartData: Array<[]>): void {
        this._ref.detectChanges();
        Highcharts.setOptions({
            chart: {
                style: {
                    fontFamily: 'Helvetica',
                },
            },
        });

        // @ts-ignore
        Highcharts.chart('container', {
            credits: {
                enabled: false,
            },
            chart: {
                zoomType: 'x',
            },
            title: {
                text: undefined,
            },
            xAxis: {
                type: 'number',
            },
            tooltip: {
                lang: {
                    thousandsSep: ',',
                },

                formatter: function () {
                    const toComma = (x: any): string => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    let balance = Number(this.y.toFixed(3));
                    if (balance > 100_000) {
                        balance = Math.round(balance);
                    }

                    let lastBlockDiff = 0;
                    if (this.x !== 0) {
                        lastBlockDiff = Number(this.y) - Number(this.series.data[Number(this.x - 1)].y);
                    }

                    return `<div style="font-size: 14px"><div>Block <strong>${
                        this.key
                    }</strong></div><br /><div>Balance <strong>${toComma(
                        balance
                    )}</strong></div><br /><div style="display: ${
                        this.x === 0 ? 'none' : 'block'
                    }"><div style="margin-right: 4px">${lastBlockDiff > 0 ? 'Receive ' : 'Send '}</div><span>${
                        lastBlockDiff > 0 ? '+' : ''
                    }</span><strong>${toComma(Number(lastBlockDiff.toFixed(3)))}</strong></div></div>`;
                },
            },
            yAxis: {
                //type: 'logarithmic',
                labels: {
                    enabled: true,
                    /*
                    formatter: (x) => {
                        console.log(x);
                    }, */
                },
                gridLineColor: this._themeService.isLightMode() ? 'rgba(66, 78, 84, 0.12)' : 'rgb(161, 167, 170, .36)',
                type: 'number',
                title: {
                    text: undefined,
                },
            },
            boost: {
                seriesThreshold: 50_000,
            },
            legend: {
                enabled: true,
            },
            plotOptions: {
                area: {
                    events: {
                        click: (e: any) => {
                            if (this.isLoadingBlock) {
                                return;
                            }
                            const height = Number(e.point.name);
                            this.isLoadingBlock = true;
                            this._apiService
                                .fetchBlockFromAddressHeight(this.address, height)
                                .then((block) => {
                                    this._searchService.emitSearch(block.hash, false);
                                })
                                .catch((err) => {
                                    console.error(err);
                                })
                                .finally(() => {
                                    this.isLoadingBlock = false;
                                });
                        },
                    },
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1,
                        },
                        stops: [
                            [0, '#4cbf4b'],
                            [1, Highcharts.color('#4cbf4b').setOpacity(0).get('rgba')],
                        ],
                    },
                    marker: {
                        radius: 2,
                    },
                    lineColor: 'gray',
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1,
                        },
                    },
                    threshold: null,
                },
            },
            series: [
                {
                    turboThreshold: this.maxInsightsLimit,
                    //\  type: 'spline',
                    color: '#249b23',
                    type: 'area',
                    name: 'BAN Balance',
                    data: chartData,
                },
            ],
        });
    }

    formatBan(ban: number): string {
        return this._util.numberWithCommas(ban);
    }

    shortenAddr(addr: string): string {
        if (!addr) {
            return 'N/A';
        }
        return this._util.shortenAddress(addr);
    }

    formatDate(unixTimestamp: number): string {
        if (unixTimestamp) {
            return `${new Date(unixTimestamp * 1000).toLocaleDateString()}, ${new Date(
                unixTimestamp * 1000
            ).toLocaleTimeString()}`;
        }
        return 'N/A';
    }

    getGraphSubtitle(): string {
        return document.ontouchstart === undefined
            ? 'Click and drag in the plot area to zoom in.'
            : 'Pinch the chart to zoom in.';
    }

    numberWithComas(num: number): string {
        return this._util.numberWithCommas(num);
    }

    getErrorDescription(): string {
        if (this.blockCount === 0) {
            return 'This account needs to receive a block before it can be analyzed.';
        }
        return 'This account has too many transactions to analyze.  Please select an account with less activity.';
    }
}
