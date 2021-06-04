import { Component, OnInit } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';
import { ApiService } from '@app/services/api/api.service';
import { AccountDistributionStats } from '@app/types/dto';
import { Options } from 'highcharts';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-wallets',
    template: `
        <div class="wallets-root" responsive>
            <div class="wallets-content">
                <div class="wallets-title" [class.mat-display-2]="!vp.sm" [class.mat-display-1]="vp.sm">
                    <ng-container *ngIf="!loading"> Banano Distribution Chart </ng-container>
                    <ng-container *ngIf="loading"> Loading </ng-container>
                </div>

                <div class="mat-subheading-2 wallets-subtitle">
                    The chart below showcases the distribution of banano among all opened banano accounts.
                </div>

                <div *ngIf="!loading" class="wallets-chart" responsive>
                    <highcharts-chart
                        [update]="true"
                        [Highcharts]="Highcharts"
                        [options]="distributionChart"
                        style="pointer-events: none; width: 100%"
                        [style.height.px]="vp.sm ? 200 : vp.md ? 350 : 400"
                    ></highcharts-chart>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit {
    Highcharts: typeof Highcharts = Highcharts;

    loading = true;
    distributionChart: Options;

    constructor(private _api: ApiService, public vp: ViewportService, public searchService: SearchService) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        this._api.bananoDistribution().then((data: AccountDistributionStats) => {
            this.distributionChart = this._createDistributionChart(data);
            this.loading = false;
        });
    }

    _createDistributionChart(data: AccountDistributionStats): Options {
        return {
            chart: {
                type: 'column',
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
                    '> .001',
                    '> .01',
                    '> .1',
                    '> 1',
                    '> 10',
                    '> 100',
                    '> 1,000',
                    '> 10,000',
                    '> 100,000',
                    '> 1,000,000',
                    '> 10,000,000',
                    '> 100,000,000',
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
                    name: 'Banano Amount',
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
                },
            ],
        };
    }
}
