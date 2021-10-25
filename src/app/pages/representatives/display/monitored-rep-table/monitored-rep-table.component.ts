import { ChangeDetectorRef, Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MonitoredRepDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AliasService } from '@app/services/alias/alias.service';
import { RepresentativesService } from '@app/pages/representatives/representatives.service';

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
                <th
                    mat-header-cell
                    *matHeaderCellDef
                    mat-sort-header
                    style="width: 100%"
                    [style.minWidth.px]="200"
                >
                    Representative
                </th>
                <td
                    class="representatives-name-cell"
                    mat-cell
                    *matCellDef="let element"
                    style="padding-top: 8px; padding-bottom: 8px"
                >
                    <span class="link primary" style="font-weight: 600" (click)="repService.openMonitoredRep(element)">
                        {{ element.name }}
                    </span>
                   <!--
                    <br />
                    <span
                        class="link monitored-reps-table-address"
                        (click)="routeRepAddress(element.address)"
                        style="margin-top: -4px; word-break: break-word"
                        [style.fontSize.px]="vp.md ? 13 : 14"
                    >
                        {{ formatAddress(element.address) }}
                    </span> -->
                </td>
            </ng-container>

            <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 210px">Address</th>
                <td class="representatives-weight-cell" mat-cell *matCellDef="let element">
                    {{ formatShortAddress(element.address) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="version">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 110px">Version</th>
                <td class="representatives-weight-cell" mat-cell *matCellDef="let element">
                    {{ repService.formatVersion(element.version) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="weight">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 140px">Weight</th>
                <td class="representatives-weight-cell" mat-cell *matCellDef="let element">
                        {{ formatBanWeight(element.weight) }}
                    <!--    <pxb-spacer></pxb-spacer>
                        <span style="font-size: 12px"
                        >{{ formatWeightPercent(element.weight) }}<span style="font-size: 10px">%</span></span
                        >
                        -->
                </td>
            </ng-container>

            <ng-container matColumnDef="delegatorsCount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 120px">Delegators</th>
                <td mat-cell *matCellDef="let element">{{ numberWithCommas(element.delegatorsCount) }}</td>
            </ng-container>

            <ng-container matColumnDef="peers">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 90px">Peers</th>
                <td mat-cell *matCellDef="let element">{{ numberWithCommas(element.peers) }}</td>
            </ng-container>

            <ng-container matColumnDef="uncheckedBlocks">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 130px;">
                    Unchecked<br />
                    Blocks
                </th>
                <td mat-cell *matCellDef="let element" [class.unchecked-blocks]="element.uncheckedBlocks">
                    {{ numberWithCommas(element.uncheckedBlocks) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="cementedBlocks">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 140px">Cemented<br />Blocks</th>
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

            <ng-container matColumnDef="memory">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 150px">Memory</th>
                <td mat-cell *matCellDef="let element">
                    {{ formatMemoryUsage(element) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="uptime">
                <th mat-header-cell *matHeaderCellDef mat-sort-header style="min-width: 150px">Uptime</th>
                <td mat-cell *matCellDef="let element">
                    {{ formatUptime(element.nodeUptimeStartup) }}
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
    @Input() monitoredReps: MonitoredRepDto[] = [];
    @Input() onlineWeight: number;
    @Input() shownColumns: any;

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
    }

    private _configureTables(): void {
        if (this.monitoredReps.length === 0) {
            return;
        }
        this.monitoredRepsDataSource = new MatTableDataSource(this.monitoredReps);
        this._ref.detectChanges();
        this.monitoredRepsDataSource.sort = this.sortMonitored;
    }

    getDisplayedColumns(): string[] {
        const displayedColumns = ['name'];
        if (this.shownColumns.showAddress) {
            displayedColumns.push('address');
        }
        if (this.shownColumns.showVersion) {
            displayedColumns.push('version');
        }
        if (this.shownColumns.showDelegatorsCount) {
            displayedColumns.push('delegatorsCount');
        }
        if (this.shownColumns.showWeight) {
            displayedColumns.push('weight');
        }
        if (this.shownColumns.showPeerCount) {
            displayedColumns.push('peers');
        }
        if (this.shownColumns.showUncheckedBlocks) {
            displayedColumns.push('uncheckedBlocks');
        }
        if (this.shownColumns.showCementedBlocks) {
            displayedColumns.push('cementedBlocks');
        }
        if (this.shownColumns.showMemory) {
            displayedColumns.push('memory');
        }
        if (this.shownColumns.showLocation) {
            displayedColumns.push('location');
        }
        if (this.shownColumns.showUptime) {
            displayedColumns.push('uptime');
        }
        return displayedColumns;
    }

    numberWithCommas(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    routeRepAddress(address: string): void {
        if (address) {
            this._searchService.emitSearch(address);
        }
    }

    formatWeightPercent(weight: number): string {
        return `${((weight / this.onlineWeight) * 100).toFixed(2).replace(/\.?0+$/, '')}`;
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }

    formatAddress(addr: string): string {
        return this.vp.md ? this._util.shortenAddress(addr) : addr;
    }


    formatShortAddress(addr: string): string {
        return this._util.shortenAddress(addr);
    }

    formatUptime(seconds: number = 0): string {
        return this._util.numberWithCommas((seconds / (60 * 60 * 24)).toFixed(1)) + ' days';
    }

    formatMemoryUsage(rep: MonitoredRepDto): string {
        return `${(Math.round(rep.usedMem) / 1024).toFixed(1)} / ${Math.ceil(rep.totalMem / 1024).toFixed(0)} GB`;
    }
}
