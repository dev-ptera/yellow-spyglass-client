import { ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MonitoredRepDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { MatSort } from '@angular/material/sort';
import { AliasService } from '@app/services/alias/alias.service';
import { RepresentativesService } from '@app/pages/representatives/representatives.service';

@Component({
    selector: 'app-monitored-rep-list',
    template: `
        <mat-card class="rep-mobile-list-container mat-elevation-z0">
            <mat-list [style.paddingTop.px]="0" class="monitored-rep-list">
                <blui-info-list-item
                    *ngFor="let rep of monitoredReps; trackBy: trackByFn; let last = last"
                    [hidePadding]="true"
                    [dense]="false"
                    [wrapSubtitle]="true"
                    [divider]="last ? undefined : 'full'"
                >
                    <div blui-title style="font-weight: 600">
                        <div class="link" (click)="repService.openMonitoredRep(rep)">{{ rep.name }}</div>
                    </div>
                    <div blui-info style="font-size: 0.875rem" class="text-secondary">{{ formatInfoLine(rep) }}</div>
                    <div
                        blui-subtitle
                        style="font-size: 0.875rem; padding-right: 16px"
                        (click)="routeRepAddress(rep.address, $event)"
                    >
                        {{ rep.address }}
                    </div>
                    <div blui-right-content style="display: flex; flex-direction: column; align-items: flex-end">
                        <div style="font-size: 0.875rem">{{ formatWeightPercent(rep.weight) }} weight</div>
                        <div style="font-size: 0.75rem; display: flex; align-items: center">
                            <img src="assets/banano-mark.svg" [width]="16" [height]="16" style="margin-right: 6px" />
                            <span class="text-secondary">{{ formatBanWeight(rep.weight) }}</span>
                        </div>
                    </div>
                </blui-info-list-item>
            </mat-list>
        </mat-card>
    `,
    styles: [
        `
            .monitored-rep-list .mat-list-item-content {
                padding: 12px 0 12px 0 !important;
                height: 7rem !important;
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
        public repService: RepresentativesService,
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

    routeRepAddress(address: string, e: MouseEvent): void {
        if (address) {
            this._searchService.emitSearch(address, e.ctrlKey);
        }
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

    formatInfoLine(rep: MonitoredRepDto): string {
        const version = this.repService.formatVersion(rep.version);
        const delegators = this.numberWithCommas(rep.delegatorsCount);
        const peers = this.numberWithCommas(rep.peers);
        return `${version} ${version ? ' · ' : ''}  ${delegators} ${delegators ? ' delegators · ' : ''} ${peers} ${
            peers ? ' peers' : ''
        }`;
    }
}
