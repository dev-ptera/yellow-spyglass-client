import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MicroRepresentativeDto, MonitoredRepDto, RepresentativeDto, RepresentativesResponseDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as Highcharts from 'highcharts';
// eslint-disable-next-line no-duplicate-imports
import { Options } from 'highcharts';
import { AliasService } from '@app/services/alias/alias.service';

@Component({
    selector: 'app-representatives',
    templateUrl: './representatives.component.html',
    styleUrls: ['./representatives.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RepresentativesComponent implements OnInit {
    Highcharts: typeof Highcharts = Highcharts;
    showOfflineRepsFilter = false;
    loading = true;
    error = false;
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

    onlineWeight: number;
    unfilteredLargeReps: RepresentativeDto[] = [];
    monitoredReps: MonitoredRepDto[] = [];

    repsChart: Options;
    chartShownReps: Array<{ name: string; address: string }> = [];

    largeRepsDataSource;
    monitoredRepsDataSource;
    monitoredRepDisplayColumns = ['name', 'version', 'delegatorsCount', 'weight', 'peers', 'uncheckedBlocks'];
    largeRepsDisplayColumnsLg = ['position', 'address', 'online',  'weight',  'percentWeight', 'delegatorsCount', 'uptimePercentMonth'];
    largeRepsDisplayColumnsMd = ['position', 'address', 'online',  'weight',  'percentWeight', 'uptimePercentMonth'];
    filteredLargeReps: RepresentativeDto[] = [];
    microReps: MicroRepresentativeDto[] = [];
    onlineLargeRepsCount = 0;
    onlineMicroRepsCount = 0;
    largeRepsTableHeader: Element;

    @ViewChild('sortAll') sortAll: MatSort;
    @ViewChild('sortMonitored') sortMonitored: MatSort;

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
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
                this.unfilteredLargeReps = data.thresholdReps;
                this.monitoredReps = data.monitoredReps;
                this.onlineWeight = data.onlineWeight;
                this.microReps = data.microReps;
                this.repsChart = this._createRepChart(this.unfilteredLargeReps);
                this.loading = false;
                data.thresholdReps.map((rep) => (rep.online ? this.onlineLargeRepsCount++ : undefined));
                data.microReps.map(() => this.onlineMicroRepsCount++);
                this.updateLargeRepsList();
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
        this.largeRepsDataSource = new MatTableDataSource(this.filteredLargeReps);
        this._ref.detectChanges();
        this.monitoredRepsDataSource.sort = this.sortMonitored;
        this.largeRepsDataSource.sort = this.sortAll;
        this.largeRepsTableHeader = document.getElementById('large-reps-table').firstChild as HTMLElement;
    }

    numberWithCommas(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }

    trackByFn(index: number): number {
        return index;
    }

    /** This is only used on mobile viewports. */
    updateLargeRepsList(): void {
        if (this.showOfflineRepsFilter) {
            this.filteredLargeReps = this.unfilteredLargeReps;
        } else {
            this.filteredLargeReps = [];
            this.unfilteredLargeReps.map((rep) => (rep.online ? this.filteredLargeReps.push(rep) : undefined));
        }
        if (!this.vp.sm) {
            this.configureTables();
        }
    }

    private _createRepChart(reps: RepresentativeDto[]): Options {
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

    openMonitoredRep(ip: string): void {
        window.open(`http://${ip}`, '_blank');
    }

    routeRepAddress(address: string): void {
        if (address) {
            this._searchService.emitSearch(address);
        }
    }

    formatVersion(version: string): string {
        if (version) {
            return version.replace('BANANO', '');
        }
        return '';
    }

    formatChartAddress(addr: string): string {
        return `${addr.substr(0, 11)}...`;
    }

    formatMonitoredRepInfoLine(rep: MonitoredRepDto): string {
        return `${this.formatVersion(rep.version)} · ${this.numberWithCommas(
            rep.delegatorsCount
        )} delegators · ${this.numberWithCommas(rep.peers)} peers`;
    }

    formatMicroRepInfoList(rep: MicroRepresentativeDto): string {
        return `${this.numberWithCommas(rep.delegatorsCount)} delegators`;
    }

    formatWeightPercent(weight: number): string {
        return `${((weight / this.onlineWeight) * 100).toFixed(1).replace(/\.?0+$/, '')}`;
    }

    isLargeRep(weight: number): boolean {
        return weight / this.onlineWeight * 100 > 5;
    }

    formatMonitoredListAddress(addr: string): string {
        return `${addr.substr(0, 12)}...${addr.substr(addr.length - 6, addr.length)}`;
    }

    formatMicroListAddress(addr: string): string {
        return this.vp.sm ? this.formatMonitoredListAddress(addr) : addr;
    }

    shortenAddress(addr: string): string {
        return `${addr.substr(0, 12)}...${addr.substr(addr.length - 6, addr.length)}`;
    }
}
