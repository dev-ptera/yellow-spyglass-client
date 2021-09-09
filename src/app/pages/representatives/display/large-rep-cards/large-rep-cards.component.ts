import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { RepresentativeDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';

@Component({
    selector: 'app-large-rep-cards',
    template: `
        <mat-card
            style="padding: 12px 12px; margin-bottom: 8px"
            *ngFor="let rep of shownReps; let i = index; trackBy: trackByFn"
            class="representatives-all-reps-card mat-elevation-z0"
        >
            <div style="align-items: center; display: flex; margin-bottom: 8px">
                <span [style.fontSize.px]="16" style="margin-right: 16px; font-weight: 600"> #{{ i + 1 }}</span>
                <pxb-list-item-tag *ngIf="rep.principal" label="Principal" class="principal-tag"></pxb-list-item-tag>
                <pxb-spacer></pxb-spacer>
                <span
                    class="mat-overline"
                    style="font-size: 11px; display: flex; align-items: center"
                    [class.primary]="rep.online"
                    [class.warn]="!rep.online"
                >
                    <span style="margin-right: 12px">{{ rep.online ? '' : 'Offline' }}</span>
                    <mat-icon style="font-size: 1.5rem">{{
                        rep.online ? 'check_circle_outline' : 'error_outline'
                    }}</mat-icon>
                </span>
            </div>

            <div
                *ngIf="aliasService.has(rep.address)"
                class="primary"
                style="font-size: 0.875rem; font-weight: 600"
                (click)="routeRepAddress(rep.address)"
            >
                {{ aliasService.get(rep.address) }}
            </div>
            <div
                style="font-size: 0.875rem; word-break: break-all; margin-bottom: 8px"
                (click)="routeRepAddress(rep.address)"
            >
                {{ formatAddress(rep.address) }}
            </div>
            <mat-divider></mat-divider>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; padding-top: 12px">
                <div>
                    <div>{{ numberWithCommas(rep.delegatorsCount) }} Delegators</div>
                    <div>
                        {{ rep.uptimePercentMonth }}% /
                        <span style="font-size: 10px">
                            {{ rep.uptimePercentWeek }}% / {{ rep.uptimePercentDay }}%
                        </span>
                        Uptime
                        <span style="font-size: 10px">(m/w/d)</span>
                    </div>
                </div>
                <div>
                    <div>{{ formatBanWeight(rep.weight) }} BAN</div>
                    <div>{{ formatWeightPercent(rep.weight) }} weight</div>
                </div>
            </div>
        </mat-card>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class LargeRepCardsComponent {
    @Input() shownReps: RepresentativeDto[] = [];
    @Input() onlineWeight: number;

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
        private readonly _util: UtilService,
        private readonly _searchService: SearchService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    numberWithCommas(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    formatWeightPercent(weight: number): string {
        return `${((weight / this.onlineWeight) * 100).toFixed(3).replace(/\.?0+$/, '')}%`;
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }

    trackByFn(index: number): number {
        return index;
    }

    formatAddress(addr: string): string {
        return this._util.shortenAddress(addr);
    }

    routeRepAddress(address: string): void {
        if (address) {
            this._searchService.emitSearch(address);
        }
    }
}
