import { ChangeDetectorRef, Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MonitoredRepDto, RepresentativeDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AliasService } from '@app/services/alias/alias.service';

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
            <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Representative</th>
                <td
                    class="representatives-name-cell"
                    mat-cell
                    *matCellDef="let element"
                    style="padding-top: 8px; padding-bottom: 8px"
                >
                    <span class="link primary" style="font-weight: 600" (click)="openMonitoredRep(element.ip)">
                        {{ element.name }}
                    </span>
                    <br />
                    <span
                        class="link monitored-reps-table-address"
                        (click)="routeRepAddress(element.address)"
                        style="padding-right: 24px; margin-top: -4px; word-break: break-word"
                        [style.fontSize.px]="vp.md ? 13 : 14"
                    >
                        {{ formatAddress(element.address) }}
                    </span>
                </td>
            </ng-container>

            <ng-container matColumnDef="version">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Version</th>
                <td class="representatives-weight-cell" mat-cell *matCellDef="let element">
                    {{ formatVersion(element.version) }}
                </td>
            </ng-container>

            <ng-container matColumnDef="weight">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Weight</th>
                <td class="representatives-weight-cell" mat-cell *matCellDef="let element">
                    {{ formatBanWeight(element.weight) }}
                    <br />
                    <span style="font-size: 12px"
                        >{{ formatWeightPercent(element.weight) }}<span style="font-size: 10px">%</span></span
                    >
                </td>
            </ng-container>

            <ng-container matColumnDef="delegatorsCount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Delegators</th>
                <td mat-cell *matCellDef="let element">{{ numberWithCommas(element.delegatorsCount) }}</td>
            </ng-container>

            <ng-container matColumnDef="peers">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Peers</th>
                <td mat-cell *matCellDef="let element">{{ numberWithCommas(element.peers) }}</td>
            </ng-container>

            <ng-container matColumnDef="uncheckedBlocks">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Unchecked<br />Blocks</th>
                <td mat-cell *matCellDef="let element" [class.unchecked-blocks]="element.uncheckedBlocks">
                    {{ numberWithCommas(element.uncheckedBlocks) }}
                </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="monitoredRepDisplayColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: monitoredRepDisplayColumns"></tr>
        </table>
    `,
    styleUrls: ['./monitored-rep-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MonitoredRepTableComponent implements OnChanges {
    @Input() monitoredReps: MonitoredRepDto[] = [];
    @Input() onlineWeight: number;

    @ViewChild('sortMonitored') sortMonitored: MatSort;

    monitoredRepsDataSource;
    monitoredRepDisplayColumns = ['name', 'version', 'delegatorsCount', 'weight', 'peers', 'uncheckedBlocks'];

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
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

    formatVersion(version: string): string {
        if (version) {
            return version.replace('BANANO', '');
        }
        return '';
    }

    openMonitoredRep(ip: string): void {
        window.open(`http://${ip}`, '_blank');
    }
}
