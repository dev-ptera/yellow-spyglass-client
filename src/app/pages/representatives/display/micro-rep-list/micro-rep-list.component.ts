import {ChangeDetectorRef, Component, Input, ViewEncapsulation} from '@angular/core';
import {ViewportService} from '@app/services/viewport/viewport.service';
import {SearchService} from '@app/services/search/search.service';
import {UtilService} from '@app/services/util/util.service';
import {AliasService} from '@app/services/alias/alias.service';
import {MicroRepresentative} from "@app/types/modal";

@Component({
    selector: 'app-micro-rep-list',
    styles: [
        `
            .representatives-micro-list .mat-list-item-content {
                padding: 0 !important;
            }
        `,
    ],
    template: `
        <mat-card class="mat-elevation-z0 divider-border" style="padding: 0">
            <mat-list [style.paddingTop.px]="0">
                <blui-info-list-item
                    *ngFor="let rep of microReps; trackBy: trackByFn; let last = last; let i = index"
                    [hidePadding]="true"
                    [dense]="false"
                    [divider]="last ? undefined : 'full'"
                >
                    <div blui-left-content style="width: 40px" class="text-secondary mat-body-2">
                        {{ i + 1 }}
                    </div>
                    <div blui-title>{{ aliasService.get(rep.address) }}</div>
                    <div blui-subtitle>
                        <span class="link" (click)="routeRepAddress(rep.address)">{{
                            formatAddress(rep.address)
                            }}</span></div>
                    <div blui-info>
                    </div>
                    <div
                        blui-right-content
                        style="display: flex; flex-direction: column; align-items: flex-end"
                    >
                        <div style="font-size: 0.875rem">{{ formatWeightPercent(rep.weight) }} weight</div>
                        <div style="font-size: 0.75rem; display: flex; align-items: center">
                            <img src="assets/banano-mark.svg" [width]="16" [height]="16" style="margin-right: 6px" />
                            {{ formatBanWeight(rep.weight) }} BAN</div>
                    </div>
                </blui-info-list-item>
            </mat-list>
        </mat-card>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class MicroRepListComponent {
    @Input() microReps: MicroRepresentative[] = [];
    @Input() onlineWeight: number;

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

    formatWeightPercent(weight: number): string {
        return `${((weight / this.onlineWeight) * 100).toFixed(4).replace(/\.?0+$/, '')}%`;
    }

    formatAddress(addr: string): string {
        return this.vp.sm ? this._util.shortenAddress(addr) : addr;
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }
}
