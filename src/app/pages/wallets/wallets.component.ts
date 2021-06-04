import { Component, OnInit } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';
import { ApiService } from '@app/services/api/api.service';
import { AccountBalance, AccountDistributionStats } from '@app/types/dto';
import { Options } from 'highcharts';
import * as Highcharts from 'highcharts';
import { UtilService } from '@app/services/util/util.service';

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

                <ng-container *ngIf="!loading">
                    <div class="wallets-chart mat-elevation-z4" responsive>
                        <highcharts-chart
                            [update]="true"
                            [Highcharts]="Highcharts"
                            [options]="distributionChart"
                            style="pointer-events: none; width: 100%"
                            [style.height.px]="vp.sm ? 300 : vp.md ? 350 : 400"
                        ></highcharts-chart>
                    </div>

                    <div class="wallets-title" [class.mat-display-2]="!vp.sm" [class.mat-display-1]="vp.sm">
                        All Accounts
                    </div>
                    <div class="mat-subheading-2 wallets-subtitle">All banano accounts, sorted by balance.</div>

                    <table
                        mat-table
                        *ngIf="accountBalances.length > 0"
                        [style.width.%]="100"
                        [dataSource]="accountBalances"
                        class="mat-elevation-z4"
                    >
                        <ng-container matColumnDef="position">
                            <th mat-header-cell *matHeaderCellDef></th>
                            <td mat-cell [style.paddingRight.px]="16" *matCellDef="let element; let i = index">
                                <span
                                    matBadgeColor="warn"
                                    matBadgeOverlap="false"
                                    matBadgeSize="medium"
                                    [matBadge]="element.repOnline ? undefined : '!'"
                                >
                                    #{{ i + 1 + offset }}
                                </span>
                            </td>
                        </ng-container>

                        <ng-container matColumnDef="addr">
                            <th mat-header-cell *matHeaderCellDef>Address</th>
                            <td
                                mat-cell
                                [style.paddingTop.px]="8"
                                [style.paddingBottom.px]="8"
                                class="wallets-address-cell"
                                *matCellDef="let element"
                                (click)="searchService.emitSearch(element.addr)"
                            >
                                {{ element.addr }}
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="ban">
                            <th mat-header-cell [style.paddingLeft.px]="16" *matHeaderCellDef>BANANO</th>
                            <td mat-cell [style.paddingLeft.px]="16" *matCellDef="let element">
                                {{ util.numberWithCommas(element.ban) }}
                            </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="columns"></tr>
                        <tr mat-row *matRowDef="let row; columns: columns"></tr>
                    </table>
                </ng-container>
            </div>
        </div>
    `,
    styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit {
    Highcharts: typeof Highcharts = Highcharts;
    loading = true;
    distributionChart: Options;
    accountBalances: AccountBalance[] = [];
    columns = ['position', 'addr', 'ban'];
    offset = 0;

    constructor(
        public util: UtilService,
        private _api: ApiService,
        public vp: ViewportService,
        public searchService: SearchService
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        Promise.all([this._api.bananoDistribution(), this._api.getAccountBalances(0)])
            .then((data) => {
                this.distributionChart = this._createDistributionChart(data[0]);
                this.accountBalances = data[1];
                this.loading = false;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    _createDistributionChart(data: AccountDistributionStats): Options {
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
                    dataLabels: {
                        style: {
                            fontSize: '12px',
                            fontWeight: '400',
                            fontFamily: 'Open Sans',
                            textOutline: 'none',
                        },
                    }
                },
            ],
        };
    }
}
