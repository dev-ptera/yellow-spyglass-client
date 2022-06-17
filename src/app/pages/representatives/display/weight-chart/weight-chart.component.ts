import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { RepresentativeDto } from '@app/types/dto';
import { UtilService } from '@app/services/util/util.service';
import * as Highcharts from 'highcharts';
// eslint-disable-next-line no-duplicate-imports
import { Options } from 'highcharts';
import { AliasService } from '@app/services/alias/alias.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';

@Component({
    selector: 'app-weight-chart',
    template: `
        <mat-card class="representatives-chart-container divider-border" responsive>
            <div class="representatives-chart" responsive>
                <highcharts-chart
                    [update]="true"
                    [Highcharts]="Highcharts"
                    [options]="repsChart"
                    style="pointer-events: none"
                    [style.width.px]="vp.sm ? 350 : vp.md ? 650 : 800"
                    [style.height.px]="vp.sm ? 300 : vp.md ? 320 : 360"
                ></highcharts-chart>
            </div>
            <div class="representatives-legend" responsive>
                <ng-container *ngIf="!vp.md && !vp.sm">
                    <div>
                        <ng-template
                            [ngTemplateOutlet]="legend"
                            [ngTemplateOutletContext]="{ repList: chartShownRepsCol1, colorOffset: 0 }"
                        >
                        </ng-template>
                    </div>
                    <div [style.marginLeft.px]="vp.md ? 0 : 24">
                        <ng-template
                            [ngTemplateOutlet]="legend"
                            [ngTemplateOutletContext]="{
                                repList: chartShownRepsCol2,
                                colorOffset: chartShownRepsCol1.length
                            }"
                        >
                        </ng-template>
                    </div>
                </ng-container>
                <ng-container *ngIf="vp.md || vp.sm">
                    <ng-template
                        [ngTemplateOutlet]="legend"
                        [ngTemplateOutletContext]="{ repList: chartShownReps, colorOffset: 0 }"
                    >
                    </ng-template>
                </ng-container>
            </div>

            <ng-template #legend let-repList="repList" let-colorOffset="colorOffset">
                <div
                    *ngFor="let rep of repList; let i = index"
                    class="representatives-legend-entry"
                    [style.fontSize.px]="vp.sm ? 12 : 15"
                >
                    <div
                        class="representatives-legend-color"
                        [style.backgroundColor]="pieChartColors[i + colorOffset]"
                    ></div>
                    <a
                        class="link text"
                        [class.representatives-legend-others]="!rep.address"
                        [routerLink]="'/' + navItems.account.route + '/' + rep.address"
                    >
                        <ng-container *ngIf="aliasService.has(rep.address)">
                            {{ aliasService.get(rep.address) }}
                        </ng-container>
                        <ng-container *ngIf="!aliasService.has(rep.address)">
                            {{ rep.name }}
                        </ng-container>
                    </a>
                </div>
            </ng-template>
        </mat-card>
    `,
    styleUrls: ['./weight-chart.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WeightChartComponent implements OnChanges {
    @Input() largeReps: RepresentativeDto[] = [];
    @Input() onlineWeight: number;
    @Input() offlineWeight: number;
    @Input() showOfflineWeight: boolean;

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
        '#ad7a4d',
        '#75c915',
        '#0d7f87',
        '#830d87',
        '#74ffff',
        '#a4d5ac',
        '#a98dde',
        '#a7a7a7',
    ];

    repsChart: Options;
    navItems = APP_NAV_ITEMS;
    chartShownReps: Array<{ name: string; address: string }> = [];
    chartShownRepsCol1: Array<{ name: string; address: string }> = [];
    chartShownRepsCol2: Array<{ name: string; address: string }> = [];

    constructor(public vp: ViewportService, public aliasService: AliasService, private readonly _util: UtilService) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnChanges(): void {
        this.repsChart = this._createRepChart();
    }

    /** When showing offline weight, the percentages of accounts with no-representative is omitted from the displayed percentages.
     * This is why offline weight % doesn't match exactly against Network page's offline weight %.
     */
    private _createRepChart(): Options {
        const totalWeight = this.showOfflineWeight ? this.onlineWeight + this.offlineWeight : this.onlineWeight;

        const reps = this.largeReps;
        const formatPercentage = (percent: number): any => Number(((percent / totalWeight) * 100).toFixed(1));

        const onlineReps = (): Array<{ name: string; y: number; address: string }> => {
            let largeRepWeight = 0;
            const MAX_REPS = 13;
            const shownReps = [];

            // Get Largest Reps
            for (const rep of reps) {
                if (!rep.online) {
                    continue;
                }
                if (shownReps.length < MAX_REPS) {
                    largeRepWeight += rep.weight;
                    shownReps.push({
                        name: this.formatChartAddress(rep.address),
                        address: rep.address,
                        y: formatPercentage(rep.weight),
                    });
                }
            }

            let allOthersWeight = this.onlineWeight - largeRepWeight;

            if (this.showOfflineWeight) {
                allOthersWeight -= this.offlineWeight;
            }

            shownReps.push({
                name: 'Other Reps',
                address: undefined,
                y: formatPercentage(allOthersWeight),
            });

            // Calculate offline weight
            if (this.showOfflineWeight) {
                shownReps.push({
                    name: 'Offline Reps',
                    address: undefined,
                    y: formatPercentage(this.offlineWeight),
                });
            }

            return shownReps;
        };
        this.chartShownReps = onlineReps();
        this.chartShownRepsCol1 = this.chartShownReps.slice(0, this.chartShownReps.length / 2);
        this.chartShownRepsCol2 = this.chartShownReps.slice(this.chartShownReps.length / 2, this.chartShownReps.length);

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
                            fontSize: this.vp.sm ? '9px' : '13px',
                            fontWeight: '400',
                            fontFamily: 'Open Sans',
                            textOutline: 'none',
                        },
                        format: '<strong>{point.y}%</strong>',
                    },
                },
            ],
        };
    }

    formatChartAddress(addr: string): string {
        return `${addr.substr(0, 11)}...`;
    }
}
