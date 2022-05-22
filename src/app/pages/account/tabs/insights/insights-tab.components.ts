import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    ViewEncapsulation,
} from '@angular/core';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { Options } from 'highcharts';
// eslint-disable-next-line no-duplicate-imports

// @ts-ignore
import * as Highcharts from 'highcharts';

@Component({
    selector: 'account-insights-tab',
    template: `
        <div class="insights-root" *ngIf="insights" responsive>
            <div class="app-section-title" [style.marginTop.px]="32">Account Balance Over Time</div>
            <div class="app-section-subtitle" style="margin-bottom: -16px">
                {{ getGraphSubtitle() }}
            </div>

            <figure [style.paddingTop.px]="vp.sm ? 32 : 48" style="margin-bottom: 32px">
                <div id="container"></div>
            </figure>

            <mat-divider style="margin: 48px 0"></mat-divider>

            <div class="app-section-title" style="margin: 32px 0">Account Statistics</div>

            <div class="insights-account-stats-container" responsive>
                <ng-template *ngIf="vp.isMediumOrSmaller()" [ngTemplateOutlet]="received"></ng-template>
                <mat-card *ngIf="!vp.isMediumOrSmaller()" class="mat-elevation-z0">
                    <ng-template [ngTemplateOutlet]="received"></ng-template>
                </mat-card>

                <ng-template *ngIf="vp.isMediumOrSmaller()" [ngTemplateOutlet]="sent"></ng-template>
                <mat-card *ngIf="!vp.isMediumOrSmaller()" class="mat-elevation-z0">
                    <ng-template [ngTemplateOutlet]="sent"></ng-template>
                </mat-card>
            </div>
        </div>

        <div class="tab-empty-state" *ngIf="blockCount >= maxInsightsLimit">
            <blui-empty-state
                responsive
                class="account-empty-state"
                title="No Insights"
                [description]="getErrorDescription()"
            >
                <mat-icon blui-empty-icon>disc_full</mat-icon>
            </blui-empty-state>
        </div>

        <div class="tab-empty-state" *ngIf="blockCount < maxInsightsLimit && !insights && !hasError">
            <blui-empty-state
                responsive
                class="account-empty-state"
                title="Loading"
                description="One second, counting them 'nanners.  Larger accounts will take longer."
            >
                <mat-icon blui-empty-icon>pending</mat-icon>
            </blui-empty-state>
        </div>

        <app-error *ngIf="hasError"></app-error>

        <ng-template #sent>
            <div class="primary node-monitor-section-title">Sent</div>
            <mat-divider></mat-divider>
            <mat-list [style.paddingTop.px]="0">
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Total BAN Sent</div>
                    <div blui-subtitle>{{ formatBan(insights.totalAmountSent) }} BAN</div>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Largest Tx Sent</div>
                    <div blui-subtitle>{{ formatBan(insights.maxAmountSent) }} BAN</div>
                    <div
                        blui-right-content
                        class="link mat-overline text-secondary"
                        (click)="search(insights.maxAmountSentHash)"
                    >
                        hash
                    </div>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title># Tx Sent</div>
                    <div blui-subtitle>{{ numberWithComas(insights.totalTxSent) }}</div>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>First-Sent Date</div>
                    <div blui-subtitle>{{ formatDate(insights.firstOutTxUnixTimestamp) }}</div>
                    <div
                        blui-right-content
                        class="link mat-overline text-secondary"
                        (click)="search(insights.firstOutTxHash)"
                    >
                        hash
                    </div>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Last-Sent Date</div>
                    <div blui-subtitle>{{ formatDate(insights.lastOutTxUnixTimestamp) }}</div>
                    <div
                        blui-right-content
                        class="link mat-overline text-secondary"
                        (click)="search(insights.lastOutTxHash)"
                    >
                        hash
                    </div>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Most Common Recipient</div>
                    <div blui-subtitle>
                        <div *ngIf="insights.mostCommonRecipientAddress">
                            Sent BAN
                            <strong style="margin: 0 4px"> {{ insights.mostCommonRecipientTxCount }} </strong> times to
                            recipient.
                        </div>
                        <div *ngIf="!insights.mostCommonRecipientAddress">This account has never sent any BAN.</div>
                    </div>
                    <div blui-info *ngIf="vp.sm" class="link " (click)="search(insights.mostCommonRecipientAddress)">
                        {{ shortenAddr(insights.mostCommonRecipientAddress) }}
                    </div>
                    <div
                        blui-right-content
                        *ngIf="!vp.sm"
                        class="link text-secondary"
                        (click)="search(insights.mostCommonRecipientAddress)"
                    >
                        {{ shortenAddr(insights.mostCommonRecipientAddress) }}
                    </div>
                </blui-info-list-item>
            </mat-list>
        </ng-template>

        <ng-template #received>
            <div class="primary node-monitor-section-title">Received</div>
            <mat-divider></mat-divider>
            <mat-list [style.paddingTop.px]="0">
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Total BAN Received</div>
                    <div blui-subtitle>{{ formatBan(insights.totalAmountReceived) }} BAN</div>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Largest Tx Received</div>
                    <div blui-subtitle>{{ formatBan(insights.maxAmountReceived) }} BAN</div>
                    <div
                        blui-right-content
                        class=" link mat-overline text-secondary"
                        (click)="search(insights.maxAmountReceivedHash)"
                    >
                        hash
                    </div>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title># Tx Received</div>
                    <div blui-subtitle>{{ numberWithComas(insights.totalTxReceived) }}</div>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>First-Received Date</div>
                    <div blui-subtitle>{{ formatDate(insights.firstInTxUnixTimestamp) }}</div>
                    <div
                        blui-right-content
                        class="link mat-overline text-secondary"
                        (click)="search(insights.firstInTxHash)"
                    >
                        hash
                    </div>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Last-Received Date</div>
                    <div blui-subtitle>{{ formatDate(insights.lastInTxUnixTimestamp) }}</div>
                    <div
                        blui-right-content
                        class="link mat-overline text-secondary"
                        (click)="search(insights.lastInTxHash)"
                    >
                        hash
                    </div>
                </blui-info-list-item>

                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Most Common Sender</div>
                    <div blui-subtitle>
                        Received BAN
                        <strong style="margin: 0 4px">{{ insights.mostCommonSenderTxCount }}</strong> times from sender.
                    </div>
                    <div blui-info *ngIf="vp.sm" class="link" (click)="search(insights.mostCommonSenderAddress)">
                        {{ shortenAddr(insights.mostCommonSenderAddress) }}
                    </div>
                    <div
                        blui-right-content
                        *ngIf="!vp.sm"
                        class="link text-secondary"
                        (click)="search(insights.mostCommonSenderAddress)"
                    >
                        {{ shortenAddr(insights.mostCommonSenderAddress) }}
                    </div>
                </blui-info-list-item>
                <blui-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div blui-title>Account Max Balance</div>
                    <div blui-subtitle>{{ formatBan(insights.maxBalance) }} BAN</div>
                    <div
                        blui-right-content
                        class="link mat-overline text-secondary"
                        (click)="search(insights.maxBalanceHash)"
                    >
                        hash
                    </div>
                </blui-info-list-item>
            </mat-list>
        </ng-template>
    `,
    styleUrls: ['insights-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InsightsTabComponent implements OnChanges {
    @Input() insights: InsightsDto;
    @Input() hasError: boolean;
    @Input() blockCount: number;
    @Input() isAccountOpened: boolean;

    Highcharts: typeof Highcharts = Highcharts;
    accountHistoryChart: Options;

    maxInsightsLimit = 100_000;

    constructor(
        public vp: ViewportService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _searchService: SearchService,
        private readonly _util: UtilService
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnChanges(): void {
        if (this.insights) {
            const chartData = [];
            for (const key of Object.keys(this.insights.heightBalances)) {
                chartData.push([key, this.insights.heightBalances[key]]);
            }
            this._graphChart(chartData);
        }
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
            /*   title: {
                text: 'Account Balance Over Time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            }, */
            xAxis: {
                type: 'number',
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
                type: 'number',
                title: {
                    text: undefined,
                },
            },
            legend: {
                enabled: true,
            },
            plotOptions: {
                area: {
                    events: {
                        click: () => {
                            console.log('click');
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

    search(value: string): void {
        if (value) {
            this._searchService.emitSearch(value);
        }
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
        if (!this.isAccountOpened) {
            return 'This account needs to receive a block before it can be analyzed.';
        }
        return 'This account has too many transactions to analyze.  Please select an account with less activity.';
    }

    private _createAccountHistoryChart(dataPoints: Array<{ balance: number; height: number }>): Options {
        const chartData = [];
        for (const point of dataPoints) {
            chartData.push(point.balance);
        }

        return {
            chart: {
                backgroundColor: 'rgba(0,0,0,0)',
            },
            tooltip: {
                enabled: true,
                valuePrefix: 'sup',
            },
            credits: {
                enabled: false,
            },
            title: {
                text: '',
            },
            xAxis: {
                visible: false,
                /*  tickmarkPlacement: 'on',
                tickAmount: dataPoints.length,
                min: 1,
                max: dataPoints[dataPoints.length-1].height,
                startOnTick: true,

               */
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                },
                labels: {
                    enabled: true,
                },
            },
            series: [
                {
                    name: 'Balance (BAN)',
                    type: 'spline',
                    color: '#FBDD11',
                    data: chartData,
                    pointPlacement: 'on',
                    dataLabels: {
                        enabled: false,
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
