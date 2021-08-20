import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { SearchService } from '@app/services/search/search.service';
import { HostNodeStatsDto } from '@app/types/dto';
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
            <mat-card>
                <div class="primary node-monitor-section-title">Node</div>
                <mat-divider></mat-divider>
                <mat-list [style.paddingTop.px]="0">
                    <pxb-info-list-item [wrapSubtitle]="true" divider="full">
                        <div pxb-icon>
                            <mat-icon>how_to_vote</mat-icon>
                        </div>
                        <div pxb-title>Address</div>
                        <div pxb-subtitle>
                            <span class="link" (click)="search(stats.address)">{{ stats.address }}</span>
                        </div>
                    </pxb-info-list-item>
                    <pxb-info-list-item>
                        <div pxb-icon>
                            <mat-icon>browser_updated</mat-icon>
                        </div>
                        <div pxb-title>Version</div>
                        <div pxb-subtitle>{{ stats.version }}</div>
                    </pxb-info-list-item>
                </mat-list>
            </mat-card>
            <mat-card>
                <div class="primary node-monitor-section-title">Block Count</div>
                <mat-divider></mat-divider>
                <mat-list [style.paddingTop.px]="0">
                    <pxb-info-list-item divider="full">
                        <div pxb-icon>
                            <mat-icon>check_circle</mat-icon>
                        </div>
                        <div pxb-title>Current Block</div>
                        <div pxb-subtitle>
                            {{ util.numberWithCommas(stats.currentBlock) }}
                        </div>
                    </pxb-info-list-item>
                    <pxb-info-list-item divider="full">
                        <div pxb-icon>
                            <mat-icon>check_circle</mat-icon>
                        </div>
                        <div pxb-title>Cemented Blocks</div>
                        <div pxb-subtitle>
                            {{ util.numberWithCommas(stats.cementedBlocks) }}
                        </div>
                    </pxb-info-list-item>
                    <pxb-info-list-item>
                        <div pxb-icon>
                            <mat-icon>running_with_errors</mat-icon>
                        </div>
                        <div pxb-title>Unchecked Blocks</div>
                        <div pxb-subtitle>
                            {{ util.numberWithCommas(stats.uncheckedBlocks) }}
                        </div>
                    </pxb-info-list-item>
                </mat-list>
            </mat-card>
            <mat-card>
                <div class="primary node-monitor-section-title">System Resources</div>
                <mat-divider></mat-divider>
                <mat-list [style.paddingTop.px]="0">
                    <pxb-info-list-item divider="full">
                        <div pxb-icon>
                            <mat-icon>memory</mat-icon>
                        </div>
                        <div pxb-title>Memory Usage</div>
                        <div pxb-subtitle>
                            {{ formatMem(stats.usedMem) }} / {{ formatMem(stats.totalMem) }}GB
                            <span class="mat-subheading-1" [style.marginLeft.px]="8">
                                ({{ formatMemoryPercentage(stats.usedMem / stats.totalMem) }}%)
                            </span>
                        </div>
                    </pxb-info-list-item>
                    <pxb-info-list-item divider="full">
                        <div pxb-icon>
                            <mat-icon>download</mat-icon>
                        </div>
                        <div pxb-title>Ledger Size</div>
                        <div pxb-subtitle>
                            {{ formatLedgerSize(stats.ledgerSizeMb) }} GB
                            <span style="margin-left: 8px">({{ formatLedgerPercent() }} of disk space)</span>
                        </div>
                    </pxb-info-list-item>
                    <pxb-info-list-item>
                        <div pxb-icon>
                            <mat-icon>storage</mat-icon>
                        </div>
                        <div pxb-title>Available Disk Space</div>
                        <div pxb-subtitle>{{ formatAvailableSpace(stats.availableDiskSpaceGb) }} GB</div>
                    </pxb-info-list-item>
                </mat-list>
            </mat-card>
            <mat-card>
                <div class="primary node-monitor-section-title">Connectivity</div>
                <mat-divider></mat-divider>
                <mat-list [style.paddingTop.px]="0">
                    <pxb-info-list-item divider="full">
                        <div pxb-icon>
                            <mat-icon>account_circle</mat-icon>
                        </div>
                        <div pxb-title>Peers</div>
                        <div pxb-subtitle>{{ stats.peers }}</div>
                    </pxb-info-list-item>
                    <pxb-info-list-item divider="full">
                        <div pxb-icon>
                            <mat-icon>timer</mat-icon>
                        </div>
                        <div pxb-title>Uptime</div>
                        <div pxb-subtitle>{{ formatUptime(stats.nodeUptimeStartup) }}</div>
                    </pxb-info-list-item>
                    <pxb-info-list-item>
                        <div pxb-icon>
                            <mat-icon>place</mat-icon>
                        </div>
                        <div pxb-title>Location</div>
                        <div pxb-subtitle>
                            {{ stats.location }}
                        </div>
                    </pxb-info-list-item>
                </mat-list>
            </mat-card>
        </ng-template>

        <div class="app-page-root" responsive>
            <div class="app-page-content node-monitor-content">
                <app-error *ngIf="error"></app-error>
                <ng-container *ngIf="!error">
                    <ng-template [ngTemplateOutlet]="titleContent"></ng-template>
                    <ng-template *ngIf="!loading" [ngTemplateOutlet]="bodyContent"></ng-template>
                </ng-container>
            </div>
        </div>

        <app-wave [waveNumber]="14"></app-wave>
    `,
    styleUrls: ['./node-monitor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NodeMonitorComponent implements OnInit {
    stats: HostNodeStatsDto;
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
            .then((stats: HostNodeStatsDto) => {
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

    formatUptime(seconds: number): string {
        return `~ ${Math.round(seconds / 60 / 60 / 24)} days`;
    }

    formatLedgerSize(mb: number): string {
        return this.util.numberWithCommas((mb / 1024).toFixed(2));
    }

    formatLedgerPercent(): string {
        const ledger = this.stats.ledgerSizeMb;
        const disk = this.stats.availableDiskSpaceGb * 1024;
        return `${((ledger / (ledger + disk)) * 100).toFixed(2)}%`;
    }

    formatMemoryPercentage(num: number): number {
        return Math.round(Number(num.toFixed(2)) * 100);
    }

    formatAvailableSpace(gb: number): string {
        return this.util.numberWithCommas(gb.toFixed(2));
    }

    openMonitoredRep(ip: string): void {
        window.open(`http://${ip}`, '_blank');
    }
}
