import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { Options } from 'highcharts';
// eslint-disable-next-line no-duplicate-imports
import * as Highcharts from 'highcharts';

@Component({
    selector: 'account-insights-tab',
    template: `
        <div class="insights-root" *ngIf="insights" responsive>
            <div class="app-section-title" [style.marginBottom.px]="16" [style.marginLeft.px]="vp.sm ? 12 : 24">
                Account Balance Over Time
            </div>
            <div class="insights-chart" responsive>
                <highcharts-chart
                    [update]="true"
                    [Highcharts]="Highcharts"
                    [options]="accountHistoryChart"
                    style="pointer-events: none; width: 100%; height: 100%;"
                    [style.height.px]="vp.sm ? 300 : vp.md ? 350 : 450"
                ></highcharts-chart>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Max BAN Received</span>
                    <span class="app-section-subtitle"> {{ formatBan(insights.maxAmountReceivedBan) }} BAN </span>
                </div>
                <div class="app-caption link" (click)="search(insights.maxAmountReceivedHash)">
                    {{ insights.maxAmountReceivedHash }}
                </div>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Max BAN Sent</span>
                    <span class="app-section-subtitle"> {{ formatBan(insights.maxAmountSentBan) }} BAN </span>
                </div>
                <div class="app-caption link" (click)="search(insights.maxAmountSentHash)">
                    {{ insights.maxAmountSentHash }}
                </div>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Account Max Balance</span>
                    <span class="app-section-subtitle"> {{ formatBan(insights.maxBalanceBan) }} BAN </span>
                </div>
                <div class="app-caption link" (click)="search(insights.maxBalanceHash)">
                    {{ insights.maxBalanceHash }}
                </div>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Most Common Recipient</span>
                    <span
                        *ngIf="insights.mostCommonRecipientAddress"
                        class="app-section-subtitle  link"
                        (click)="search(insights.mostCommonRecipientAddress)"
                    >
                        {{ insights.mostCommonRecipientAddress }}
                    </span>
                    <span *ngIf="!insights.mostCommonRecipientAddress">N/A</span>
                </div>
                <div *ngIf="insights.mostCommonRecipientAddress" class="app-caption">
                    Account sent BAN
                    <strong style="margin: 0 4px"> {{ insights.mostCommonRecipientTxCount }} </strong> times to the
                    above recipient.
                </div>
                <div *ngIf="!insights.mostCommonRecipientAddress" class="app-caption">
                    This account has never sent any BAN.
                </div>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Most Common Sender</span>
                    <span class="app-section-subtitle  link" (click)="search(insights.mostCommonSenderAddress)">
                        {{ insights.mostCommonSenderAddress }}
                    </span>
                </div>
                <div class="app-caption">
                    Account received BAN
                    <strong style="margin: 0 4px"> {{ insights.mostCommonSenderTxCount }} </strong> times from above
                    sender.
                </div>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Total BAN Sent</span>
                    <span class="app-section-subtitle"> {{ formatBan(insights.totalAmountSentBan) }} BAN </span>
                </div>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Total BAN Received</span>
                    <span class="app-section-subtitle"> {{ formatBan(insights.totalAmountReceivedBan) }} BAN </span>
                </div>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Last Received Date</span>
                    <span class="app-section-subtitle"> {{ formatDate(insights.lastReceivedUnixTimestamp) }} </span>
                </div>
            </div>
            <div class="insights-section">
                <div>
                    <span class="app-section-title">Last Sent Date</span>
                    <span class="app-section-subtitle"> {{ formatDate(insights.lastSentUnixTimestamp) }} </span>
                </div>
            </div>
        </div>
        <pxb-empty-state
            *ngIf="!error && !insights && !disabled"
            responsive
            class="account-empty-state"
            title="Loading"
            description="One second, counting them 'nanners.  Larger accounts will take longer."
        >
            <mat-icon pxb-empty-icon>pending</mat-icon>
        </pxb-empty-state>
        <pxb-empty-state
            *ngIf="disabled"
            responsive
            class="account-empty-state"
            title="No Insights"
            [description]="getErrorDescription()"
        >
            <mat-icon pxb-empty-icon>disc_full</mat-icon>
        </pxb-empty-state>
        <app-error *ngIf="error"></app-error>
    `,
    styleUrls: ['insights-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class InsightsTabComponent implements OnChanges {
    @Input() insights: InsightsDto;
    @Input() error: boolean;
    @Input() disabled: boolean;
    @Input() unopened: boolean;

    Highcharts: typeof Highcharts = Highcharts;
    accountHistoryChart: Options;

    constructor(
        private readonly _searchService: SearchService,
        public vp: ViewportService,
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
            this.accountHistoryChart = this._createAccountHistoryChart(this.insights.data);
        }
    }

    search(value: string): void {
        this._searchService.emitSearch(value);
    }

    formatBan(ban: number): string {
        return this._util.numberWithCommas(ban);
    }

    formatDate(unixTimestamp: number): string {
        if (unixTimestamp) {
            return `${new Date(unixTimestamp * 1000).toLocaleDateString()}, ${new Date(
                unixTimestamp * 1000
            ).toLocaleTimeString()}`;
        }
        return 'N/A';
    }

    getErrorDescription(): string {
        if (this.unopened) {
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
