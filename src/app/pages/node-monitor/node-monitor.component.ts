import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { SearchService } from '@app/services/search/search.service';
import { MonitoredRepDto } from '@app/types/dto';
import { ApiService } from '@app/services/api/api.service';

@Component({
    selector: 'app-monitor',
    template: `
        <ng-template #titleContent>
            <div class="app-page-title">
                <span *ngIf="loading">Loading</span>
                <span *ngIf="!loading">Node Statistics</span>
            </div>
            <div class="app-page-subtitle">
                This explorer is powered & maintained by the
                <span class="link primary" (click)="openMonitoredRep(stats.ip)">batman representative</span>.
            </div>
        </ng-template>

        <ng-template #bodyContent>
            <div class="monitor-section">
                <div>
                    <span class="app-section-title">Address</span>
                    <span class="app-section-subtitle link primary" (click)="search(stats.address)">{{
                        stats.address
                    }}</span>
                </div>
            </div>
            <div class="monitor-section">
                <div>
                    <span class="app-section-title">Version</span>
                    <span class="app-section-subtitle">{{ stats.version }}</span>
                </div>
            </div>
            <div class="monitor-section">
                <div>
                    <span class="app-section-title">Memory Usage</span>
                    <span class="app-section-subtitle">
                        {{ formatMem(stats.usedMem) }} / {{ formatMem(stats.totalMem) }}GB
                        <span class="mat-subheading-1" [style.marginLeft.px]="8">
                            ({{ formatMemoryPercentage(stats.usedMem / stats.totalMem) }}%)
                        </span>
                    </span>
                </div>
            </div>
            <div class="monitor-section">
                <div>
                    <span class="app-section-title">Current Block</span>
                    <span class="app-section-subtitle">{{ util.numberWithCommas(stats.currentBlock) }}</span>
                </div>
            </div>
            <div class="monitor-section">
                <div>
                    <span class="app-section-title">Unchecked Blocks</span>
                    <span class="app-section-subtitle">{{ util.numberWithCommas(stats.uncheckedBlocks) }}</span>
                </div>
            </div>
            <div class="monitor-section">
                <div>
                    <span class="app-section-title">Location</span>
                    <span class="app-section-subtitle">{{ stats.location }}</span>
                </div>
            </div>
            <div class="monitor-section">
                <div>
                    <span class="app-section-title">Peers</span>
                    <span class="app-section-subtitle">{{ stats.peers }}</span>
                </div>
            </div>
        </ng-template>

        <div class="app-page-root" responsive>
            <div class="app-page-content">
                <app-error *ngIf="error"></app-error>
                <ng-container *ngIf="!error">
                    <ng-template [ngTemplateOutlet]="titleContent"></ng-template>
                    <ng-template *ngIf="!loading" [ngTemplateOutlet]="bodyContent"></ng-template>
                </ng-container>
            </div>
        </div>
    `,
    styleUrls: ['./node-monitor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NodeMonitorComponent implements OnInit {
    stats: MonitoredRepDto;
    loading = true;
    error = false;

    constructor(
        private readonly _api: ApiService,
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
                this.error = true;
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

    formatMemoryPercentage(num: number): number {
        return Math.round(Number(num.toFixed(2)) * 100);
    }
}
