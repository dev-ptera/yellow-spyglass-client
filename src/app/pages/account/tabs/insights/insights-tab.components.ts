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
            <div class="app-section-title" responsive [style.marginBottom.px]="16">Account Balance Over Time</div>
            <div class="insights-chart" responsive>
                <highcharts-chart
                    [update]="true"
                    [Highcharts]="Highcharts"
                    [options]="accountHistoryChart"
                    style="pointer-events: none; width: 100%; height: 100%;"
                    [style.height.px]="vp.sm ? 300 : vp.md ? 350 : 450"
                ></highcharts-chart>
            </div>

            <div class="app-section-title" responsive [style.marginBottom.px]="16" [style.marginTop.px]="32">
                Account Statistics
            </div>
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

        <ng-template #sent>
            <div class="primary node-monitor-section-title">Sent</div>
            <mat-divider></mat-divider>
            <mat-list [style.paddingTop.px]="0">
                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Total BAN Sent</div>
                    <div pxb-subtitle>{{ formatBan(insights.totalAmountSentBan) }} BAN</div>
                </pxb-info-list-item>
                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Largest Tx Sent</div>
                    <div pxb-subtitle>{{ formatBan(insights.maxAmountSentBan) }} BAN</div>
                    <div pxb-right-content class=" link mat-overline" (click)="search(insights.maxAmountSentHash)">
                        hash
                    </div>
                </pxb-info-list-item>

                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title># Tx Sent</div>
                    <div pxb-subtitle>{{ numberWithComas(insights.totalTxSent) }}</div>
                </pxb-info-list-item>

                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>First-Sent Date</div>
                    <div pxb-subtitle>{{ formatDate(insights.firstOutTxUnixTimestamp) }}</div>
                    <div pxb-right-content class="link mat-overline" (click)="search(insights.firstOutTxHash)">
                        hash
                    </div>
                </pxb-info-list-item>

                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Last-Sent Date</div>
                    <div pxb-subtitle>{{ formatDate(insights.lastOutTxUnixTimestamp) }}</div>
                    <div pxb-right-content class="link mat-overline" (click)="search(insights.lastOutTxHash)">hash</div>
                </pxb-info-list-item>
                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Most Common Recipient</div>
                    <div pxb-subtitle>
                        <div *ngIf="insights.mostCommonRecipientAddress">
                            Sent BAN
                            <strong style="margin: 0 4px"> {{ insights.mostCommonRecipientTxCount }} </strong> times to
                            recipient.
                        </div>
                        <div *ngIf="!insights.mostCommonRecipientAddress">This account has never sent any BAN.</div>
                    </div>
                    <div pxb-info *ngIf="vp.sm" class="link" (click)="search(insights.mostCommonRecipientAddress)">
                        {{ shortenAddr(insights.mostCommonRecipientAddress) }}
                    </div>
                    <div
                        pxb-right-content
                        *ngIf="!vp.sm"
                        class="link"
                        (click)="search(insights.mostCommonRecipientAddress)"
                    >
                        {{ shortenAddr(insights.mostCommonRecipientAddress) }}
                    </div>
                </pxb-info-list-item>
            </mat-list>
        </ng-template>

        <ng-template #received>
            <div class="primary node-monitor-section-title">Received</div>
            <mat-divider></mat-divider>
            <mat-list [style.paddingTop.px]="0">
                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Total BAN Received</div>
                    <div pxb-subtitle>{{ formatBan(insights.totalAmountReceivedBan) }} BAN</div>
                </pxb-info-list-item>
                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Largest Tx Received</div>
                    <div pxb-subtitle>{{ formatBan(insights.maxAmountReceivedBan) }} BAN</div>
                    <div pxb-right-content class=" link mat-overline" (click)="search(insights.maxAmountReceivedHash)">
                        hash
                    </div>
                </pxb-info-list-item>

                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title># Tx Received</div>
                    <div pxb-subtitle>{{ numberWithComas(insights.totalTxReceived) }}</div>
                </pxb-info-list-item>

                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>First-Received Date</div>
                    <div pxb-subtitle>{{ formatDate(insights.firstInTxUnixTimestamp) }}</div>
                    <div pxb-right-content class="link mat-overline" (click)="search(insights.firstInTxHash)">hash</div>
                </pxb-info-list-item>
                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Last-Received Date</div>
                    <div pxb-subtitle>{{ formatDate(insights.lastInTxUnixTimestamp) }}</div>
                    <div pxb-right-content class="link mat-overline" (click)="search(insights.lastInTxHash)">hash</div>
                </pxb-info-list-item>

                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Most Common Sender</div>
                    <div pxb-subtitle>
                        Received BAN
                        <strong style="margin: 0 4px">{{ insights.mostCommonSenderTxCount }}</strong> times from sender.
                    </div>
                    <div pxb-info *ngIf="vp.sm" class="link" (click)="search(insights.mostCommonSenderAddress)">
                        {{ shortenAddr(insights.mostCommonSenderAddress) }}
                    </div>
                    <div
                        pxb-right-content
                        *ngIf="!vp.sm"
                        class="link"
                        (click)="search(insights.mostCommonSenderAddress)"
                    >
                        {{ shortenAddr(insights.mostCommonSenderAddress) }}
                    </div>
                </pxb-info-list-item>
                <pxb-info-list-item [wrapSubtitle]="true" divider="full" [hidePadding]="true">
                    <div pxb-title>Account Max Balance</div>
                    <div pxb-subtitle>{{ formatBan(insights.maxBalanceBan) }} BAN</div>
                    <div pxb-right-content class="link mat-overline" (click)="search(insights.maxBalanceHash)">
                        hash
                    </div>
                </pxb-info-list-item>
            </mat-list>
        </ng-template>
    `,
    styleUrls: ['insights-tab.component.scss'],
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

    numberWithComas(num: number): string {
        return this._util.numberWithCommas(num);
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
