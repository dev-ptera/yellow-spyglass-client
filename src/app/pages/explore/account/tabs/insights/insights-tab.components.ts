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
        <div class="insights-root" *ngIf="insights">
            <div class="insights-chart" responsive>
                <highcharts-chart
                    [update]="true"
                    [Highcharts]="Highcharts"
                    [options]="accountHistoryChart"
                    style="pointer-events: none; width: 100%; height: 100%;"
                    [style.height.px]="vp.sm ? 300 : vp.md ? 350 : 450"
                ></highcharts-chart>
            </div>
        </div>
        <pxb-empty-state
            *ngIf="!insights"
            responsive
            class="account-empty-state"
            title="No Insights"
            description="This account has too many transactions to analyze.  Please view an account with less activity."
        >
            <mat-icon pxb-empty-icon>how_to_vote</mat-icon>
        </pxb-empty-state>
    `,
    styleUrls: ['insights-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class InsightsTabComponent implements OnChanges {
    @Input() insights: InsightsDto;

    Highcharts: typeof Highcharts = Highcharts;
    accountHistoryChart: Options;

    constructor(public searchService: SearchService, public vp: ViewportService, private readonly _util: UtilService) {
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
                valuePrefix: 'sup'
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
                    name: 'Account Balance',
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
