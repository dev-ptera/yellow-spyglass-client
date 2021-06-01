import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MonitoredRepDto, RepresentativeDto, RepresentativesResponseDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';

@Component({
    selector: 'app-representatives',
    templateUrl: './representatives.component.html',
    styleUrls: ['./representatives.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RepresentativesComponent implements OnInit {
    Highcharts: typeof Highcharts = Highcharts;
    loading = true;
    error = false;

    onlineWeight: number;
    representatives: RepresentativeDto[] = [];
    monitoredReps: MonitoredRepDto[] = [];

    repsChart: Options;

    allRepsDataSource;
    monitoredRepsDataSource;
    monitoredRepDisplayColumns = [
        'name',
        'address',
        'version',
        'delegatorsCount',
        'weight',
        'peers',
        'uncheckedBlocks',
    ];
    allRepsDisplayColumns = ['position', 'address', 'weight', 'online', 'delegatorsCount'];

    @ViewChild('sortAll') sortAll: MatSort;
    @ViewChild('sortMonitored') sortMonitored: MatSort;

    constructor(
        public vp: ViewportService,
        private readonly _util: UtilService,
        private readonly _searchService: SearchService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _api: ApiService
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        this._api
            .representatives()
            .then((data: RepresentativesResponseDto) => {
                this.representatives = data.representatives;
                this.monitoredReps = data.monitoredReps;
                this.onlineWeight = data.onlineWeight;
                this.repsChart = this._createRepChart(this.representatives);
                this.loading = false;
                this.configureTables();
            })
            .catch((err) => {
                console.error(err);
                this.loading = false;
                this.error = true;
            });
    }

    configureTables(): void {
        this._ref.detectChanges();
        this.monitoredRepsDataSource = new MatTableDataSource(this.monitoredReps);
        this.allRepsDataSource = new MatTableDataSource(this.representatives);
        this._ref.detectChanges();
        this.monitoredRepsDataSource.sort = this.sortMonitored;
        this.allRepsDataSource.sort = this.sortAll;
    }

    formatDelegatorsCount(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    formatWeightPercent(weight: number): string {
        return ((weight / this.onlineWeight) * 100).toFixed(3).replace(/\.?0+$/, '') + '%';
    }

    formatTableAddress(addr: string): string {
        return `${addr.substr(0, 12)}...${this.vp.md ? '' : addr.substr(addr.length - 6, addr.length)}`;
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }

    trackByFn(index) {
        return index;
    }

    _createRepChart(reps: RepresentativeDto[]): Options {
        const onlineReps = () => {
            let allOthersWeight = this.onlineWeight;
            const MAX_REPS = 5;
            const shownReps = [];

            // Get Largest Reps
            for (const rep of reps) {
                if (!rep.online) {
                    continue;
                }
                if (shownReps.length < MAX_REPS) {
                    shownReps.push({
                        name: this.formatChartAddress(rep.address),
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
                y: allOthersWeight,
            });
            return shownReps;
        };
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
            plotOptions: {
                pie: {
                    showInLegend: false,
                },
            },
            series: [
                {
                    name: 'Representatives',
                    type: 'pie',
                    colors: ['#FBDD11', '#1fb32e', '#eead4a', '#6eee99', '#ee4ac5', '#7F6CD9'],
                    data: onlineReps(),
                    dataLabels: {
                        enabled: true,
                        distance: this.vp.sm ? 10 : 20,
                        style: {
                            fontSize: this.vp.sm ? '12px' : '16px',
                            fontWeight: '400',
                            fontFamily: 'Open Sans',
                            color: '#424e54',
                        },
                        format: '{point.name}<br/><strong>{point.percentage:.1f}%</strong>',
                    },
                },
            ],
        };
    }

    formatChartAddress(addr: string): string {
        return `${addr.substr(0, 11)}...`;
    }

    openMonitoredRep(ip: string): void {
        window.open(`http://${ip}`, '_blank');
    }

    routeRepAddress(rep: MonitoredRepDto) {
        this._searchService.emitSearch(rep.address);
    }
}
