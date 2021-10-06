import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MicroRepresentativeDto, RepresentativeDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';

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
        <mat-card class="rep-mobile-list-container mat-elevation-z0">
            <mat-list [style.paddingTop.px]="0" class="representatives-micro-list">
                <pxb-info-list-item
                    *ngFor="let rep of microReps; trackBy: trackByFn; let last = last; let i = index"
                    [hidePadding]="true"
                    [dense]="false"
                    [divider]="last ? undefined : 'full'"
                >
                    <div pxb-left-content style="width: 32px; font-weight: 600" [style.marginLeft.px]="vp.sm ? 0 : 16">
                        #{{ i + 1 }}
                    </div>
                    <div pxb-title class="primary">{{ aliasService.get(rep.address) }}</div>
                    <div pxb-subtitle style="font-size: 0.875rem">{{ formatMicroRepInfoList(rep) }}</div>
                    <div pxb-info>
                        <span class="link" (click)="routeRepAddress(rep.address)">{{
                            formatAddress(rep.address)
                        }}</span>
                    </div>
                    <div
                        pxb-right-content
                        style="display: flex; flex-direction: column; align-items: flex-end"
                        [style.marginRight.px]="vp.sm ? 0 : 16"
                    >
                        <div style="font-size: 0.875rem">{{ formatBanWeight(rep.weight) }} BAN</div>
                        <div style="font-size: 0.75rem">{{ formatWeightPercent(rep.weight) }} weight</div>
                    </div>
                </pxb-info-list-item>
            </mat-list>
        </mat-card>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class MicroRepListComponent {
    @Input() microReps: RepresentativeDto[] = [];
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

    formatMicroRepInfoList(rep: MicroRepresentativeDto): string {
        return `${this.numberWithCommas(rep.delegatorsCount)} delegators`;
    }
}
