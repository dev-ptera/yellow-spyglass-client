import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { RepresentativeDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
// eslint-disable-next-line no-duplicate-imports
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
import { AliasService } from '@app/services/alias/alias.service';

@Component({
    selector: 'app-weight-chart',
    template: `
        <div class="representatives-chart-container" responsive>
            <div class="representatives-chart" responsive>
                <highcharts-chart
                    [update]="true"
                    [Highcharts]="Highcharts"
                    [options]="repsChart"
                    style="pointer-events: none"
                    [style.width.px]="vp.sm ? 350 : vp.md ? 650 : 800"
                    [style.height.px]="vp.sm ? 270 : vp.md ? 300 : 350"
                ></highcharts-chart>
            </div>
            <div class="representatives-legend">
                <div
                    *ngFor="let rep of chartShownReps; let i = index; let last = last"
                    class="representatives-legend-entry"
                    [style.fontSize.px]="vp.sm ? 12 : 15"
                >
                    <div class="representatives-legend-color" [style.backgroundColor]="pieChartColors[i]"></div>
                    <div
                        class="link"
                        [class.representatives-legend-others]="last"
                        (click)="routeRepAddress(rep.address)"
                    >
                        <ng-container *ngIf="aliasService.has(rep.address)">
                            {{ aliasService.get(rep.address) }}
                        </ng-container>
                        <ng-container *ngIf="!aliasService.has(rep.address)">
                            {{ rep.name }}
                        </ng-container>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./weight-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WeightChartComponent implements OnChanges {
    @Input() largeReps: RepresentativeDto[] = [];
    @Input() onlineWeight: number;

    Highcharts: typeof Highcharts = Highcharts;
    pieChartColors = [
        '#FBDD11',
        '#1fb32e',
        '#eead4a',
        '#6eee99',
        '#ee4ac5',
        '#6b54db',
        '#d92d2d',
        '#1d9eef',
        '#8d8881',
        '#75c915',
        '#0d7f87',
    ];

    repsChart: Options;
    chartShownReps: Array<{ name: string; address: string }> = [];

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
        private readonly _util: UtilService,
        private readonly _searchService: SearchService
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnChanges(): void {
        this.repsChart = this._createRepChart();
    }

    private _createRepChart(): Options {
        const reps = this.largeReps;
        const onlineReps = (): Array<{ name: string; y: number; address: string }> => {
            let allOthersWeight = this.onlineWeight;
            const MAX_REPS = 7;
            const shownReps = [];

            // Get Largest Reps
            for (const rep of reps) {
                if (!rep.online) {
                    continue;
                }
                if (shownReps.length < MAX_REPS) {
                    shownReps.push({
                        name: this.formatChartAddress(rep.address),
                        address: rep.address,
                        y: rep.weight,
                    });
                }
            }

            // Calculate all other reps weight
            let i = 1;
            for (const rep of reps) {
                if (!rep.online) {
                    continue;
                }
                if (i++ >= shownReps.length) {
                    break;
                }
                allOthersWeight -= rep.weight;
            }
            shownReps.push({
                name: 'Other Reps',
                address: undefined,
                y: allOthersWeight,
            });
            return shownReps;
        };
        this.chartShownReps = onlineReps();
        return {
            chart: {
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
            legend: {
                enabled: false,
                /*
                align: this.vp.sm ? 'center' : 'right',
                layout: 'vertical',
                verticalAlign: 'top',
                x: 0,
                y: 0,
                itemStyle: {
                    fontWeight: "400",
                    padding: "16px"
                }
                 */
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                },
            },
            series: [
                {
                    name: 'Representatives',
                    type: 'pie',
                    colors: this.pieChartColors,
                    data: this.chartShownReps,
                    dataLabels: {
                        enabled: true,
                        distance: 30,
                        style: {
                            fontSize: this.vp.sm ? '12px' : '14px',
                            fontWeight: '400',
                            fontFamily: 'Open Sans',
                            textOutline: 'none',
                        },
                        format: '<strong>{point.percentage:.1f}%</strong>',
                    },
                },
            ],
        };
    }

    routeRepAddress(address: string): void {
        if (address) {
            this._searchService.emitSearch(address);
        }
    }
    formatChartAddress(addr: string): string {
        return `${addr.substr(0, 11)}...`;
    }
}
