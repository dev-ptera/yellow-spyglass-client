import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MicroRepresentativeDto, MonitoredRepDto, RepresentativeDto, RepresentativesResponseDto } from '@app/types/dto';
import { MatSort } from '@angular/material/sort';
import { Theme } from '@app/services/theme/theme.service';

export type MonitoredRepTableColumns = {
    address: boolean;
    version: boolean;
    delegatorsCount: boolean;
    weightBan: boolean;
    weightPercent: boolean;
    peerCount: boolean;
    uncheckedBlocks: boolean;
    cementedBlocks: boolean;
    memory: boolean;
    lastRestart: boolean;
    location: boolean;
    isPrincipal: boolean;
    uptime: boolean;
};

@Component({
    selector: 'app-representatives',
    templateUrl: './representatives.component.html',
    styleUrls: ['./representatives.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RepresentativesComponent implements OnInit {
    @ViewChild('sortAll') sortAll: MatSort;
    @ViewChild('sortMonitored') sortMonitored: MatSort;

    showOfflineRepsFilter = false;
    showOfflineWeight = false;
    loading = true;
    error = false;
    monitoredRepColumnToggle = false;

    onlineWeight: number;
    offlineWeight: number;
    allLargeReps: RepresentativeDto[] = [];
    monitoredReps: MonitoredRepDto[] = [];
    microReps: MicroRepresentativeDto[] = [];
    onlineLargeRepsCount = 0;
    onlineMicroRepsCount = 0;
    shownLargeReps: RepresentativeDto[] = [];
    monitoredRepsShownColumnsKey = 'YELLOW_SPYGLASS_MONITORED_REP_COLUMNS';

    /* Defaults */
    shownColumns: MonitoredRepTableColumns = {
        address: true,
        version: true,
        delegatorsCount: false,
        weightBan: true,
        weightPercent: false,
        peerCount: true,
        uncheckedBlocks: true,
        cementedBlocks: false,
        memory: true,
        lastRestart: true,
        location: false,
        isPrincipal: true,
        uptime: false,
    };

    constructor(public vp: ViewportService, private readonly _api: ApiService) {}

    ngOnInit(): void {
        this._parseMonitoredRepsShownColumns();
        this._api
            .representatives()
            .then((data: RepresentativesResponseDto) => {
                this.allLargeReps = data.thresholdReps;
                this.monitoredReps = data.monitoredReps;
                this.onlineWeight = data.onlineWeight;
                this.offlineWeight = data.offlineWeight;
                this.microReps = data.microReps;
                this.loading = false;
                data.thresholdReps.map((rep) => (rep.online ? this.onlineLargeRepsCount++ : undefined));
                data.microReps.map(() => this.onlineMicroRepsCount++);
                this.filterLargeRepsByStatus();
            })
            .catch((err) => {
                console.error(err);
                this.loading = false;
                this.error = true;
            });
    }

    _parseMonitoredRepsShownColumns(): void {
        const showColumns = localStorage.getItem(this.monitoredRepsShownColumnsKey);
        if (showColumns) {
            this.shownColumns = JSON.parse(showColumns);
        }
    }

    filterLargeRepsByStatus(): void {
        this.shownLargeReps = [];
        if (this.showOfflineRepsFilter) {
            this.shownLargeReps = this.allLargeReps;
        } else {
            this.allLargeReps.map((rep) => (rep.online ? this.shownLargeReps.push(rep) : undefined));
        }
    }

    toggleColumn(column: keyof MonitoredRepTableColumns): void {
        this.shownColumns[column] = !this.shownColumns[column];
        localStorage.setItem(this.monitoredRepsShownColumnsKey, JSON.stringify(this.shownColumns));
    }
}
