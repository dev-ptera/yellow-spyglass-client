import { ChangeDetectorRef, Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MonitoredRepDto, RepresentativeDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AliasService } from '@app/services/alias/alias.service';
import { RepresentativesService } from '@app/pages/representatives/representatives.service';
import { MonitoredRepTableColumns } from '@app/pages/representatives/representatives.component';

@Component({
    selector: 'app-monitored-rep-table',
    template: `
        <table
            mat-table
            [hidden]="vp.sm"
            responsive
            [dataSource]="monitoredRepsDataSource"
            #sortMonitored="matSort"
            matSort
            class="mat-elevation-z2 monitored-reps-table"
            id="large-reps-table"
        >
            <ng-container matColumnDef="name" sticky>
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="width: 100%" [style.minWidth.px]="200">
                    Representative
                </th>
                <td
                    class="representatives-name-cell"
                    mat-cell
                    *matCellDef="let element"
                    style="padding-top: 8px; padding-bottom: 8px; padding-right: 8px"
                >
                    <span class="link primary" style="font-weight: 600" (click)="repService.openMonitoredRep(element)">
                        {{ element.name }}
                    </span>
                </td>
            </ng-container>

            <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 220px">Address</th>
                <td class="representatives-weight-cell" mat-cell *matCellDef="let element">
                    <span (click)="routeRepAddress(element.address, $event)" class="link">
                        {{formatShortAddress(element.address)}}</span>
                </td>
            </ng-container>

            <ng-container matColumnDef="version">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 100px">Version</th>
                <td class="representatives-weight-cell" mat-cell *matCellDef="let element">
                    {{ repService.formatVersion(element.version) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="weightBan">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 130px">Weight</th>
                <td mat-cell *matCellDef="let element">
                    {{ formatBanWeight(element.weight) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="weightPercent">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 90px">%</th>
                <td mat-cell *matCellDef="let element">
                    <ng-container *ngIf="element.weight">
                        {{ formatWeightPercent(element.weight) }}<span style="font-size: 10px">%</span>
                    </ng-container>
                </td>
            </ng-container>

            <ng-container matColumnDef="delegatorsCount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 110px">Delegators</th>
                <td mat-cell *matCellDef="let element">{{ numberWithCommas(element.delegatorsCount) }}</td>
            </ng-container>

            <ng-container matColumnDef="peers">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 80px">Peers</th>
                <td mat-cell *matCellDef="let element">{{ numberWithCommas(element.peers) }}</td>
            </ng-container>

            <ng-container matColumnDef="uncheckedBlocks">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 120px;">
                    Unchecked<br />
                    Blocks
                </th>
                <td mat-cell *matCellDef="let element" [class.unchecked-blocks]="element.uncheckedBlocks">
                    {{ numberWithCommas(element.uncheckedBlocks) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="cementedBlocks">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 130px">Cemented<br />Blocks</th>
                <td mat-cell *matCellDef="let element">
                    {{ numberWithCommas(element.cementedBlocks) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 180px">Location</th>
                <td mat-cell *matCellDef="let element">
                    {{ element.location }}
                </td>
            </ng-container>

            <ng-container matColumnDef="totalMem">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 130px">Memory</th>
                <td mat-cell *matCellDef="let element">
                    {{ formatMemoryUsage(element) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="nodeUptimeStartup">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 120px">Last Restart</th>
                <td mat-cell *matCellDef="let element">
                    {{ formatUptime(element.nodeUptimeStartup) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="isPrincipal">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 80px">PR</th>
                <td mat-cell *matCellDef="let element">
                    <mat-icon
                        *ngIf="repService.isPR(element.weight, onlineWeight)"
                        style="font-size: 1.5rem"
                        class="primary"
                        >verified</mat-icon
                    >
                </td>
            </ng-container>

            <!-- TODO: MAKE me a component -->
            <ng-container matColumnDef="uptime">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 150px">
                    <div style="text-align: left">
                        Uptime
                        <ng-container *ngIf="!vp.md">
                            <br />
                            <div style="font-size: 10px; margin-top: -4px">month · week · day</div>
                        </ng-container>
                    </div>
                </th>
                <td mat-cell *matCellDef="let element">
                    <ng-container *ngIf="largeRepMap.has(element.address)">
                        <span
                            [class.warn]="largeRepMap.get(element.address)?.uptimePercentMonth <= 80"
                            [class.intermediary]="
                                largeRepMap.get(element.address)?.uptimePercentMonth > 80 &&
                                largeRepMap.get(element.address)?.uptimePercentMonth <= 95
                            "
                            [class.primary]="largeRepMap.get(element.address)?.uptimePercentMonth > 95"
                        >
                            {{ largeRepMap.get(element.address)?.uptimePercentMonth
                            }}<span style="font-size: 11px">% </span>
                        </span>
                        <span *ngIf="!vp.md" style="font-size: 11px"
                            >· {{ largeRepMap.get(element.address)?.uptimePercentWeek }}% ·
                            {{ largeRepMap.get(element.address)?.uptimePercentDay }}%
                        </span>
                    </ng-container>
                    <ng-container *ngIf="!largeRepMap.has(element.address)">--</ng-container>
                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="getDisplayedColumns(); sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: getDisplayedColumns()"></tr>
        </table>
    `,
    styleUrls: ['./monitored-rep-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MonitoredRepTableComponent implements OnChanges {
    @Input() largeReps: RepresentativeDto[] = [];
    @Input() monitoredReps: MonitoredRepDto[] = [];
    @Input() onlineWeight: number;
    @Input() shownColumns: MonitoredRepTableColumns;

    largeRepMap: Map<string, RepresentativeDto> = new Map();

    @ViewChild('sortMonitored') sortMonitored: MatSort;

    monitoredRepsDataSource;

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
        public repService: RepresentativesService,
        private readonly _util: UtilService,
        private readonly _searchService: SearchService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    ngOnChanges(): void {
        this._configureTables();
        this._createNewRepMap();
    }

    private _configureTables(): void {
        if (this.monitoredReps.length === 0) {
            return;
        }
        this.monitoredRepsDataSource = new MatTableDataSource(this.monitoredReps);
        this._ref.detectChanges();
        this.monitoredRepsDataSource.sort = this.sortMonitored;
        this.monitoredRepsDataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
                case 'isPrincipal': {
                    return item['weight'];
                }
                case 'weightBan': {
                    return item['weight'];
                }
                case 'weightPercent': {
                    return item['weight'];
                }
                case 'uptime': {
                    return this.largeRepMap.get(item['address'])?.uptimePercentMonth;
                }
                default: {
                    return item[property];
                }
            }
        };
    }

    private _createNewRepMap(): void {
        this.largeRepMap.clear();
        for (const rep of this.largeReps) {
            this.largeRepMap.set(rep.address, rep);
        }
    }

    getDisplayedColumns(): string[] {
        const displayedColumns = ['name'];
        if (this.shownColumns.address) {
            displayedColumns.push('address');
        }
        if (this.shownColumns.version) {
            displayedColumns.push('version');
        }
        if (this.shownColumns.delegatorsCount) {
            displayedColumns.push('delegatorsCount');
        }
        if (this.shownColumns.weightBan) {
            displayedColumns.push('weightBan');
        }
        if (this.shownColumns.weightPercent) {
            displayedColumns.push('weightPercent');
        }
        if (this.shownColumns.peerCount) {
            displayedColumns.push('peers');
        }
        if (this.shownColumns.uncheckedBlocks) {
            displayedColumns.push('uncheckedBlocks');
        }
        if (this.shownColumns.cementedBlocks) {
            displayedColumns.push('cementedBlocks');
        }
        if (this.shownColumns.memory) {
            displayedColumns.push('totalMem');
        }
        if (this.shownColumns.location) {
            displayedColumns.push('location');
        }
        if (this.shownColumns.lastRestart) {
            displayedColumns.push('nodeUptimeStartup');
        }
        if (this.shownColumns.isPrincipal) {
            displayedColumns.push('isPrincipal');
        }
        if (this.shownColumns.uptime) {
            displayedColumns.push('uptime');
        }
        return displayedColumns;
    }

    numberWithCommas(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    routeRepAddress(address: string, e: MouseEvent): void {
        if (address) {
            this._searchService.emitSearch(address, e.ctrlKey);
        }
    }

    formatWeightPercent(weight: number): string {
        return `${((weight / this.onlineWeight) * 100).toFixed(2).replace(/\.?0+$/, '')}`;
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }

    formatShortAddress(addr: string): string {
        return this._util.shortenAddress(addr);
    }

    formatUptime(seconds: number = 0): string {
        return this._util.numberWithCommas((seconds / (60 * 60 * 24)).toFixed(1)) + ' days';
    }

    formatMemoryUsage(rep: MonitoredRepDto): string {
        if (rep.usedMem && rep.totalMem) {
            return `${(Math.round(rep.usedMem) / 1024).toFixed(1)} / ${Math.ceil(rep.totalMem / 1024).toFixed(0)} GB`;
        }
    }
}
