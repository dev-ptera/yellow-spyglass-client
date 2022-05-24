import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { Representative } from '@app/types/modal';

@Component({
    selector: 'app-large-rep-cards',
    template: `
        <mat-card
            style="padding: 12px 12px; margin-bottom: 8px"
            *ngFor="let rep of shownReps; let i = index; trackBy: trackByFn"
            class="representatives-all-reps-card mat-elevation-z0 divider-border"
        >
            <div style="align-items: center; display: flex; margin-bottom: 8px">
                <span [style.fontSize.px]="16" class="text-secondary" style="margin-right: 16px; font-weight: 600">
                    #{{ i + 1 }}</span
                >
                <blui-list-item-tag *ngIf="rep.principal" label="Principal" class="principal-tag"></blui-list-item-tag>
                <blui-spacer></blui-spacer>
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
                style="font-size: 0.875rem; font-weight: 600"
                (click)="routeRepAddress(rep.address, $event)"
            >
                {{ aliasService.get(rep.address) }}
            </div>
            <div
                style="font-size: 0.875rem; word-break: break-all; margin-bottom: 8px"
                (click)="routeRepAddress(rep.address, $event)"
            >
                {{ rep.address }}
            </div>
            <mat-divider></mat-divider>
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; padding-top: 12px">
                <div>
                    <div *ngIf="rep.score">
                        Score:&nbsp;
                        {{ rep.score }}
                        <span style="font-size: 11px" class="text-secondary"> /100</span>
                    </div>
                    <div *ngIf="rep.uptimePercentages">
                        Uptime:&nbsp;
                        {{ rep.uptimePercentages.month }}% /
                        <span style="font-size: 11px" class="text-secondary">
                            {{ rep.uptimePercentages.week }}% / {{ rep.uptimePercentages.day }}% (m/w/d)
                        </span>
                    </div>
                </div>
                <div>
                    <div *ngIf="rep.online" style="text-align: right">
                        Weight:&nbsp; {{ formatWeightPercent(rep.weight) }}
                    </div>
                    <div style="display: flex; align-items: center" class="text-secondary">
                        <img src="assets/banano-mark.svg" [width]="16" [height]="16" style="margin-right: 6px" />
                        {{ formatBanWeight(rep.weight) }}
                    </div>
                </div>
            </div>
        </mat-card>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class LargeRepCardsComponent {
    @Input() shownReps: Representative[] = [];
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

    routeRepAddress(address: string, e: MouseEvent): void {
        if (address) {
            this._searchService.emitSearch(address, e.ctrlKey);
        }
    }
}
