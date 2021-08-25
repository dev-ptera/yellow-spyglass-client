import { ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MonitoredRepDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatSort } from '@angular/material/sort';
import { AliasService } from '@app/services/alias/alias.service';

@Component({
    selector: 'app-monitored-rep-list',
    template: `
        <mat-card style="padding: 0 12px">
            <mat-list [style.paddingTop.px]="0" class="monitored-rep-list">
                <pxb-info-list-item
                    *ngFor="let rep of monitoredReps; trackBy: trackByFn"
                    [hidePadding]="true"
                    [dense]="false"
                    divider="full"
                >
                    <div pxb-title>
                        <div class="link primary" (click)="openMonitoredRep(rep.ip)">{{ rep.name }}</div>
                    </div>
                    <div pxb-subtitle style="font-size: 0.875rem">{{ formatInfoLine(rep) }}</div>
                    <div pxb-info style="font-size: 0.875rem" (click)="routeRepAddress(rep.address)">
                        {{ formatAddress(rep.address) }}
                    </div>
                    <div pxb-right-content style="display: flex; flex-direction: column; align-items: flex-end">
                        <div style="font-size: 0.875rem">{{ formatBanWeight(rep.weight) }} BAN</div>
                        <div style="font-size: 0.75rem">{{ formatWeightPercent(rep.weight) }} weight</div>
                    </div>
                </pxb-info-list-item>
            </mat-list>
        </mat-card>
    `,
    styles: [
        `
            .monitored-rep-list .mat-list-item-content {
                padding: 12px 0 12px 0 !important;
                height: unset !important;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MonitoredRepListComponent {
    @Input() monitoredReps: MonitoredRepDto[] = [];
    @Input() onlineWeight: number;

    @ViewChild('sortMonitored') sortMonitored: MatSort;

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
        private readonly _util: UtilService,
        private readonly _searchService: SearchService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    trackByFn(index: number): number {
        return index;
    }

    numberWithCommas(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    routeRepAddress(address: string): void {
        if (address) {
            this._searchService.emitSearch(address);
        }
    }

    openMonitoredRep(ip: string): void {
        window.open(`http://${ip}`, '_blank');
    }

    formatWeightPercent(weight: number): string {
        return `${((weight / this.onlineWeight) * 100).toFixed(3).replace(/\.?0+$/, '')}%`;
    }

    formatAddress(addr: string): string {
        return this._util.shortenAddress(addr);
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }

    formatVersion(version: string): string {
        if (version) {
            return version.toUpperCase().replace('BANANO', '');
        }
        return '';
    }

    formatInfoLine(rep: MonitoredRepDto): string {
        return `${this.formatVersion(rep.version)} · ${this.numberWithCommas(
            rep.delegatorsCount
        )} delegators · ${this.numberWithCommas(rep.peers)} peers`;
    }
}
