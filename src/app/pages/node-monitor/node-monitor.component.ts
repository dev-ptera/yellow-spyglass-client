import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { SearchService } from '@app/services/search/search.service';
import { MonitoredRepDto } from '@app/types/dto';
import { ApiService } from '@app/services/api/api.service';

@Component({
    selector: 'app-monitor',
    template: `
        <div class="monitor-root" responsive>
            <div class="monitor-content">
                <div [class.mat-display-2]="!vp.sm" [class.mat-display-1]="vp.sm" [style.marginBottom.px]="8">
                    <span *ngIf="loading">Loading</span>
                    <span *ngIf="!loading">Node Statistics</span>
                </div>
                <div class="mat-subheading-2" [style.marginBottom.px]="48">
                    This explorer is powered by the
                    <span class="link" (click)="openMonitoredRep(stats.ip)">batman representative</span>.
                </div>

                <ng-container *ngIf="!loading && stats">
                    <div class="monitor-section">
                        <div>
                            <span class="mat-headline">Address</span>
                            <span class="mat-subheading-2 link" (click)="search(stats.address)">{{ stats.address }}</span>
                        </div>
                    </div>
                    <div class="monitor-section">
                        <div>
                            <span class="mat-headline">Version</span>
                            <span class="mat-subheading-2">{{ stats.version }}</span>
                        </div>
                    </div>
                    <div class="monitor-section">
                        <div>
                            <span class="mat-headline">Memory Usage</span>
                            <span class="mat-subheading-2">
                                {{ formatMem(stats.usedMem) }} / {{ formatMem(stats.totalMem) }}GB
                            <span class="mat-subheading-1" [style.marginLeft.px]="8">
                                ({{ formatMemoryPercentage(stats.usedMem/stats.totalMem) }}%)
                            </span>
                        </span>
                        </div>
                    </div>
                    <div class="monitor-section">
                        <div>
                            <span class="mat-headline">Current Block</span>
                            <span class="mat-subheading-2">{{ util.numberWithCommas(stats.currentBlock) }}</span>
                        </div>
                    </div>
                    <div class="monitor-section">
                        <div>
                            <span class="mat-headline">Unchecked Blocks</span>
                            <span class="mat-subheading-2">{{ util.numberWithCommas(stats.uncheckedBlocks) }}</span>
                        </div>
                    </div>
                    <div class="monitor-section">
                        <div>
                            <span class="mat-headline">Location</span>
                            <span class="mat-subheading-2">{{ stats.location }}</span>
                        </div>
                    </div>
                    <div class="monitor-section">
                        <div>
                            <span class="mat-headline">Peers</span>
                            <span class="mat-subheading-2">{{ stats.peers }}</span>
                        </div>
                    </div>
                </ng-container>
            </div>
        </div>
    `,
    styleUrls: ['./node-monitor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NodeMonitorComponent implements OnInit {
    @Input() stats: MonitoredRepDto;
    @Input() loading = true;

    constructor(
        private _api: ApiService,
        public vp: ViewportService,
        public util: UtilService,
        private readonly _searchService: SearchService
    ) {}

    ngOnInit(): void {
        this._api
            .node()
            .then((stats: MonitoredRepDto) => {
                this.stats = stats;
                this.loading = false;
            })
            .catch((err) => {
                console.error(err);
                this.loading = false;
            });
    }

    formatMem(mem: number): number {
        return Math.round(mem / 1000);
    }

    search(value: string): void {
        this._searchService.emitSearch(value);
    }

    openMonitoredRep(ip: string): void {
        window.open(`http://${ip}`, '_blank');
    }

    formatMemoryPercentage(num): number {
        return Number(num.toFixed(2)) * 100;
    }
}
