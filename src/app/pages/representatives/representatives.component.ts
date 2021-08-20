import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MicroRepresentativeDto, MonitoredRepDto, RepresentativeDto, RepresentativesResponseDto } from '@app/types/dto';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-representatives',
    templateUrl: './representatives.component.html',
    styleUrls: ['./representatives.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RepresentativesComponent implements OnInit {
    showOfflineRepsFilter = false;
    loading = true;
    error = false;

    onlineWeight: number;
    allLargeReps: RepresentativeDto[] = [];
    monitoredReps: MonitoredRepDto[] = [];
    microReps: MicroRepresentativeDto[] = [];
    onlineLargeRepsCount = 0;
    onlineMicroRepsCount = 0;
    shownLargeReps: RepresentativeDto[] = [];

    @ViewChild('sortAll') sortAll: MatSort;
    @ViewChild('sortMonitored') sortMonitored: MatSort;

    constructor(public vp: ViewportService, private readonly _api: ApiService) {}

    ngOnInit(): void {
        this._api
            .representatives()
            .then((data: RepresentativesResponseDto) => {
                this.allLargeReps = data.thresholdReps;
                this.monitoredReps = data.monitoredReps;
                this.onlineWeight = data.onlineWeight;
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

    filterLargeRepsByStatus(): void {
        this.shownLargeReps = [];
        if (this.showOfflineRepsFilter) {
            this.shownLargeReps = this.allLargeReps;
        } else {
            this.allLargeReps.map((rep) => (rep.online ? this.shownLargeReps.push(rep) : undefined));
        }
    }
}
