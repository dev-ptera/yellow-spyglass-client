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
            <div class="app-page-title">Node Statistics</div>
            <div class="app-page-subtitle">
                This explorer is powered & maintained by the
                <span class="link primary"
                      (click)="openMonitoredRep(stats.monitorUrl)">
                    batman representative</span>.
            </div>
        </ng-template>

        <ng-template #bodyContent>
            <div class="node-section-wrapper" responsive>
                <mat-card class="divider-border">
                    <div class="primary node-monitor-section-title">Node</div>
                    <mat-divider></mat-divider>
                    <mat-list [style.paddingTop.px]="0">
                        <blui-info-list-item [wrapSubtitle]="true" divider="full">
                            <div blui-icon>
                                <mat-icon>how_to_vote</mat-icon>
                            </div>
                            <div blui-title>Address</div>
                            <div blui-subtitle>
                                <span class="link" (click)="search(stats.addressAsRepresentative, $event)">{{
                                    stats.addressAsRepresentative
                                    }}</span>
                            </div>
                        </blui-info-list-item>
                        <blui-info-list-item divider="full">
                            <div blui-icon>
                                <mat-icon>browser_updated</mat-icon>
                            </div>
                            <div blui-title>Protocol Version</div>
                            <div blui-subtitle>{{ stats.nodeVendor }}</div>
                        </blui-info-list-item>
                        <blui-info-list-item>
                            <div blui-icon>
                                <mat-icon>disc_full</mat-icon>
                            </div>
                            <div blui-title>Database Version</div>
                            <div blui-subtitle>{{ stats.storeVendor }}</div>
                        </blui-info-list-item>
                    </mat-list>
                </mat-card>
                <mat-card class="divider-border">
                    <div class="primary node-monitor-section-title">Block Count</div>
                    <mat-divider></mat-divider>
                    <mat-list [style.paddingTop.px]="0">
                        <blui-info-list-item divider="full">
                            <div blui-icon>
                                <mat-icon>check_circle</mat-icon>
                            </div>
                            <div blui-title>Current Block</div>
                            <div blui-subtitle>
                                {{ util.numberWithCommas(stats.currentBlock) }}
                            </div>
                        </blui-info-list-item>
                        <blui-info-list-item divider="full">
                            <div blui-icon>
                                <mat-icon>check_circle</mat-icon>
                            </div>
                            <div blui-title>Cemented Blocks</div>
                            <div blui-subtitle>
                                {{ util.numberWithCommas(stats.cementedBlocks) }}
                            </div>
                        </blui-info-list-item>
                        <blui-info-list-item>
                            <div blui-icon>
                                <mat-icon>running_with_errors</mat-icon>
                            </div>
                            <div blui-title>Unchecked Blocks</div>
                            <div blui-subtitle>
                                {{ util.numberWithCommas(stats.uncheckedBlocks) }}
                            </div>
                        </blui-info-list-item>
                    </mat-list>
                </mat-card>
                <mat-card class="divider-border">
                    <div class="primary node-monitor-section-title">System Resources</div>
                    <mat-divider></mat-divider>
                    <mat-list [style.paddingTop.px]="0">
                        <blui-info-list-item divider="full">
                            <div blui-icon>
                                <mat-icon>memory</mat-icon>
                            </div>
                            <div blui-title>Memory Usage</div>
                            <div blui-subtitle>
                                {{ formatMemory(stats.usedMemoryGB) }} / {{ formatMemory(stats.totalMemoryGB) }}GB
                                <span class="mat-subheading-1" [style.marginLeft.px]="8">
                                    ({{ formatMemoryPercentage(stats.usedMemoryGB / stats.totalMemoryGB) }}%)
                                </span>
                            </div>
                        </blui-info-list-item>
                        <blui-info-list-item divider="full">
                            <div blui-icon>
                                <mat-icon>download</mat-icon>
                            </div>
                            <div blui-title>Ledger Size</div>
                            <div blui-subtitle>
                                {{ formatLedgerSize(stats.ledgerSizeMB) }} GB
                                <span style="margin-left: 8px">({{ formatLedgerPercent() }} of disk space)</span>
                            </div>
                        </blui-info-list-item>
                        <blui-info-list-item>
                            <div blui-icon>
                                <mat-icon>storage</mat-icon>
                            </div>
                            <div blui-title>Available Disk Space</div>
                            <div blui-subtitle>{{ formatAvailableSpace(stats.availableDiskSpaceGB) }} GB</div>
                        </blui-info-list-item>
                    </mat-list>
                </mat-card>
                <mat-card class="divider-border">
                    <div class="primary node-monitor-section-title">Connectivity</div>
                    <mat-divider></mat-divider>
                    <mat-list [style.paddingTop.px]="0">
                        <blui-info-list-item divider="full">
                            <div blui-icon>
                                <mat-icon>account_circle</mat-icon>
                            </div>
                            <div blui-title>Peers</div>
                            <div blui-subtitle>{{ stats.peerCount }}</div>
                        </blui-info-list-item>
                        <blui-info-list-item divider="full">
                            <div blui-icon>
                                <mat-icon>timer</mat-icon>
                            </div>
                            <div blui-title>Uptime</div>
                            <div blui-subtitle>{{ formatUptime(stats.nodeUptimeSeconds) }}</div>
                        </blui-info-list-item>
                        <blui-info-list-item>
                            <div blui-icon>
                                <mat-icon>place</mat-icon>
                            </div>
                            <div blui-title>Location</div>
                            <div blui-subtitle>
                                {{ stats.location }}
                            </div>
                        </blui-info-list-item>
                    </mat-list>
                </mat-card>
            </div>
        </ng-template>

        <div class="app-page-root" responsive>
            <div class="app-page-content node-monitor-content" responsive>
                <app-error *ngIf="hasError"></app-error>
                <ng-container *ngIf="!hasError">
                    <ng-template [ngTemplateOutlet]="titleContent"></ng-template>
                    <div *ngIf="!isLoading" class="animation-body">
                        <ng-template [ngTemplateOutlet]="bodyContent"></ng-template>
                    </div>
                </ng-container>
            </div>
        </div>
    `,
    styleUrls: ['./node-monitor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NodeMonitorComponent implements OnInit {
    stats: HostNodeStatsDto;
    isLoading = true;
    hasError = false;

    constructor(
        private readonly _api: ApiService,
        public vp: ViewportService,
        public util: UtilService,
        private readonly _searchService: SearchService
    ) {}

    ngOnInit(): void {
        this._api
            .fetchHostNodeStats()
            .then((stats: HostNodeStatsDto) => {
                this.stats = stats;
                this.isLoading = false;
            })
            .catch((err) => {
                console.error(err);
                this.isLoading = false;
                this.hasError = true;
            });
    }

    search(value: string, e: MouseEvent): void {
        this._searchService.emitSearch(value, e.ctrlKey);
    }

    formatMemory(mem: number): string {
        if (mem) {
            return mem.toFixed(1);
        }
    }

    formatLedgerSize(mb: number): string {
        if (mb) {
            return this.util.numberWithCommas((mb / 1024).toFixed(2));
        }
    }

    formatLedgerPercent(): string {
        const ledger = this.stats.ledgerSizeMB;
        const disk = this.stats.availableDiskSpaceGB * 1024;
        if (!ledger || !disk) {
            return;
        }
        return `${((ledger / (ledger + disk)) * 100).toFixed(2)}%`;
    }

    formatUptime(seconds: number): string {
        if (seconds) {
            return `~ ${Math.round(seconds / 60 / 60 / 24)} days`;
        }
    }

    formatAvailableSpace(gb: number): string {
        if (gb) {
            return this.util.numberWithCommas(gb.toFixed(2));
        }
    }

    formatMemoryPercentage(num: number): number {
        if (num) {
            return Math.round(Number(num.toFixed(2)) * 100);
        }
    }

    openMonitoredRep(ip: string): void {
        window.open(`http://${ip}`, '_blank');
    }
}
