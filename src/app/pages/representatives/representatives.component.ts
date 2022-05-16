import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MonitoredRepDto, RepresentativeDto } from '@app/types/dto';
import { MatSort } from '@angular/material/sort';

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

    isLoading = true;
    hasError = false;
    showOfflineWeight = false;
    showOfflineReps = false;
    monitoredRepColumnToggle = false;

    onlineWeight: number;
    offlineWeight: number;
    onlineLargeRepsCount = 0;
    allLargeReps: RepresentativeDto[] = [];
    monitoredReps: MonitoredRepDto[] = [];
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

        Promise.all([
            this._api.fetchRepresentatives(),
            this._api.fetchQuorumStats(),
            this._api.fetchRepresentativeScores(),
        ])
            .then((data) => {
                this.isLoading = false;
                this.allLargeReps = data[0];
                this.onlineWeight = data[1].onlineWeight;
                this.offlineWeight = data[1].offlineWeight;
                this._formatMonitoredRepsData(this.allLargeReps);

                this._filterLargeRepsByStatus();
            })
            .catch((err) => {
                console.error(err);
                this.isLoading = false;
                this.hasError = true;
            });
    }

    /** Itereates through the list of representatives and fills in missing data from the Monitored reps list. */
    private _formatMonitoredRepsData(reps: RepresentativeDto[]): void {
        reps.map((rep) => {
            if (rep.nodeMonitorStats) {
                this.monitoredReps.push({
                    address: rep.address,
                    online: rep.online,
                    delegatorsCount: rep.delegatorsCount,
                    ...rep.nodeMonitorStats,
                });
            }
        });
    }

    /** Reads local storage to determine which columns we should show on the monitored rep table. */
    private _parseMonitoredRepsShownColumns(): void {
        const showColumns = localStorage.getItem(this.monitoredRepsShownColumnsKey);
        if (showColumns) {
            this.shownColumns = JSON.parse(showColumns);
        }
    }

    private _filterLargeRepsByStatus(): void {
        this.shownLargeReps = [];
        if (this.showOfflineReps) {
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
