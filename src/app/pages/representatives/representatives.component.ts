import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MonitoredRepDto, RepresentativeDto, RepresentativesResponseDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-representatives',
    templateUrl: './representatives.component.html',
    styleUrls: ['./representatives.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RepresentativesComponent implements OnInit {
    loading = true;
    error = false;

    onlineWeight: number;
    representatives: RepresentativeDto[] = [];
    monitoredReps: MonitoredRepDto[] = [];

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
    allRepsDataSource;
    allRepsDisplayColumns = ['address', 'delegatorsCount', 'weight', 'online'];

    @ViewChild('sortAll') sortAll: MatSort;
    @ViewChild('sortMonitored') sortMonitored: MatSort;

    constructor(
        public vp: ViewportService,
        private readonly _util: UtilService,
        private readonly _searchService: SearchService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _api: ApiService
    ) {}

    ngOnInit(): void {
        this._api
            .representatives()
            .then((data: RepresentativesResponseDto) => {
                this.representatives = data.representatives;
                this.monitoredReps = data.monitoredReps;
                this.onlineWeight = data.onlineWeight;
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

    routeRepAddress(rep: MonitoredRepDto) {
        this._searchService.emitSearch(rep.address);
    }

    formatDelegatorsCount(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    formatPercent(weight: number): string {
        return ((weight / this.onlineWeight) * 100).toFixed(3).replace(/\.?0+$/, '') + '%';
    }

    formatTableAddress(addr: string): string {
        return `${addr.substr(0, 12)}...${addr.substr(addr.length - 6, addr.length)}`;
    }

    trackByFn(index) {
        return index;
    }
}
