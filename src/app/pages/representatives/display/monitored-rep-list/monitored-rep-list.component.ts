import {ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {ViewportService} from '@app/services/viewport/viewport.service';
import {MonitoredRepDto} from '@app/types/dto';
import {SearchService} from '@app/services/search/search.service';
import {UtilService} from '@app/services/util/util.service';
import {MatSort} from '@angular/material/sort';
import {AliasService} from '@app/services/alias/alias.service';

@Component({
    selector: 'app-monitored-rep-list',
    template: `
        <mat-card style="padding: 0 12px">
            <mat-list [style.paddingTop.px]="0" class="representatives-monitored-list">
                <pxb-info-list-item
                    *ngFor="let rep of monitoredReps; trackBy: trackByFn"
                    [hidePadding]="true"
                    [dense]="false"
                    divider="full"
                >
                    <div pxb-title>
                        <span class="link primary" (click)="openMonitoredRep(rep.ip)">{{ rep.name }}</span>
                    </div>
                    <div pxb-subtitle style="font-size: 0.875rem">{{ formatMonitoredRepInfoLine(rep) }}</div>
                    <div pxb-info style="font-size: 0.875rem" (click)="routeRepAddress(rep.address)">
                        {{ formatMonitoredListAddress(rep.address) }}
                    </div>
                    <div pxb-right-content style="display: flex; flex-direction: column; align-items: flex-end">
                        <div style="font-size: 0.875rem">{{ formatBanWeight(rep.weight) }} BAN</div>
                        <div style="font-size: 0.75rem">{{ formatWeightPercent(rep.weight) }} weight</div>
                    </div>
                </pxb-info-list-item>
            </mat-list>
        </mat-card>
    `,
    styleUrls: ['./monitored-rep-list.component.scss'],
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

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
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
        return `${((weight / this.onlineWeight) * 100).toFixed(1).replace(/\.?0+$/, '')}`;
    }

    formatMonitoredListAddress(addr: string): string {
        return `${addr.substr(0, 12)}...${addr.substr(addr.length - 6, addr.length)}`;
    }

    formatVersion(version: string): string {
        if (version) {
            return version.replace('BANANO', '');
        }
        return '';
    }

    formatMonitoredRepInfoLine(rep: MonitoredRepDto): string {
        return `${this.formatVersion(rep.version)} · ${this.numberWithCommas(
            rep.delegatorsCount
        )} delegators · ${this.numberWithCommas(rep.peers)} peers`;
    }

}
