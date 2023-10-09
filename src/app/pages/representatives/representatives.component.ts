import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MonitoredRepDto, RepScoreDto } from '@app/types/dto';
import { MatSort } from '@angular/material/sort';
import { MicroRepresentative, MonitoredRep, Representative } from '@app/types/modal';

export type MonitoredRepTableColumns = {
    address: boolean;
    version: boolean;
    fundedDelegatorsCount: boolean;
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
    expandedMonitoredTable = false;
    showOfflineWeight = false;
    showOfflineReps = false;

    onlineWeight: number;
    offlineWeight: number;
    onlineLargeRepsCount = 0;
    microReps: MicroRepresentative[] = [];
    allLargeReps: Representative[] = [];
    monitoredReps: MonitoredRep[] = [];
    shownLargeReps: Representative[] = [];
    monitoredRepsShownColumnsKey = 'CREEPER_MONITORED_REP_COLUMNS';

    /* Defaults */
    shownColumns: MonitoredRepTableColumns = {
        address: true,
        version: true,
        fundedDelegatorsCount: false,
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

    constructor(
        public vp: ViewportService,
        private readonly _api: ApiService
    ) {}

    ngOnInit(): void {
        this._parseMonitoredRepsShownColumns();

        Promise.all([
            this._api.fetchLargeRepresentatives(),
            this._api.fetchMonitoredRepresentatives(),
            this._api.fetchQuorumStats(),
            this._api.fetchRepresentativeScores(),
        ])
            .then((data) => {
                this.isLoading = false;
                this.allLargeReps = data[0];
                this.monitoredReps = data[1];
                this.onlineWeight = data[2].onlineWeight;
                this.offlineWeight = data[2].offlineWeight;
                this._attachScores(data[3], this.allLargeReps);
                this._attachScores(data[3], this.monitoredReps);
                this._countMicroReps(this.monitoredReps, this.allLargeReps);
                this.filterLargeRepsByStatus();
                this.onlineLargeRepsCount = this._countOnlineReps(this.allLargeReps);
            })
            .catch((err) => {
                console.error(err);
                this.isLoading = false;
                this.hasError = true;
            });
    }

    /** Reads local storage to determine which columns we should show on the monitored rep table. */
    private _parseMonitoredRepsShownColumns(): void {
        const showColumns = localStorage.getItem(this.monitoredRepsShownColumnsKey);
        if (showColumns) {
            this.shownColumns = JSON.parse(showColumns);
        }
    }

    filterLargeRepsByStatus(): void {
        this.shownLargeReps = [];
        if (this.showOfflineReps) {
            this.shownLargeReps = this.allLargeReps;
        } else {
            this.allLargeReps.map((rep) => (rep.online ? this.shownLargeReps.push(rep) : undefined));
        }
    }

    /** Iterates through the list of monitored reps and adds smaller reps to a separate list. */
    private _countMicroReps(monitoredReps: MonitoredRepDto[], largeReps: Representative[]): void {
        // If a monitored representative also appears in the large representative list, update the monitored rep's
        // weight here.  Sometimes a mis-configured node monitor or syncing node will emit reported weight.
        // Don't want to accidentally include a large rep in the micro rep list if we can help it.
        const largeRepMap = new Map<string, Representative>();
        largeReps.map((rep) => largeRepMap.set(rep.address, rep));

        this.microReps = [];
        monitoredReps.map((rep) => {
            if (largeRepMap.has(rep.address)) {
                rep.weight = largeRepMap.get(rep.address).weight;
                return;
            }
            if (rep.weight < 100_000) {
                this.microReps.push({
                    address: rep.address,
                    weight: rep.weight,
                });
            }
        });
        this.microReps.sort((a, b) => (a.weight < b.weight ? 1 : -1));
    }

    private _attachScores(scores: RepScoreDto[], repList: Representative[] | MonitoredRep[]): void {
        const scoreMap = new Map<string, RepScoreDto>();
        scores.map((scoreResponse) => scoreMap.set(scoreResponse.address, scoreResponse));
        repList.map((rep) => {
            const scoreResponse = scoreMap.get(rep.address);
            if (scoreResponse) {
                scoreResponse.uptimePercentages.day = Number(scoreResponse.uptimePercentages.day.toFixed(1));
                scoreResponse.uptimePercentages.week = Number(scoreResponse.uptimePercentages.week.toFixed(1));
                scoreResponse.uptimePercentages.month = Number(scoreResponse.uptimePercentages.month.toFixed(1));
                rep.uptimePercentages = scoreResponse.uptimePercentages;
                rep.principal = scoreResponse.principal;
                rep.score = scoreResponse.score;
            }
        });
    }

    private _countOnlineReps(reps: Representative[]): number {
        let online = 0;
        reps.map((rep) => {
            if (rep.online) {
                online++;
            }
        });
        return online;
    }

    toggleColumn(e: Event, column: keyof MonitoredRepTableColumns): void {
        e.stopPropagation();
        this.shownColumns[column] = !this.shownColumns[column];
        localStorage.setItem(this.monitoredRepsShownColumnsKey, JSON.stringify(this.shownColumns));
    }
}
