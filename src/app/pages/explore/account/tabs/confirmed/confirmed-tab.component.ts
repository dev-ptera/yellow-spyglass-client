import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ConfirmedTransaction } from '@app/types/modal/ConfirmedTransaction';
import { MonkeyCacheService } from '@app/services/monkey-cache/monkey-cache.service';
import { SearchService } from '@app/services/search/search.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { PaginatorComponent } from '../../../../../common/components/paginator/paginator.component';
import { UtilService } from '@app/services/util/util.service';

@Component({
    selector: 'account-confirmed-tab',
    template: `
        <ng-template [ngTemplateOutlet]="paginator"></ng-template>
        <mat-divider></mat-divider>

        <mat-list class="tab-transaction-list" *ngIf="confirmedTransactions.length >= 0" responsive>
            <pxb-info-list-item
                *ngFor="let tx of confirmedTransactions; trackBy: trackByFn"
                [divider]="true"
                [wrapTitle]="true"
                [wrapSubtitle]="false"
                [hidePadding]="true"
                style="position: relative"
            >
                <div pxb-icon>
                    <div
                        *ngIf="monkeyCache.getMonkey(tx.address)"
                        [innerHTML]="monkeyCache.getMonkey(tx.address) | safe"
                    ></div>
                </div>
                <div pxb-title>
                    <div class="tag-row">
                        <pxb-list-item-tag [label]="tx.formatHeight" [class]="'height ' + tx.type"></pxb-list-item-tag>
                        <pxb-list-item-tag [label]="tx.type" [class]="'type ' + tx.type"></pxb-list-item-tag>
                        <span *ngIf="tx.type !== 'change'" [class]="'amount ' + tx.type">{{ tx.balance }}</span>
                    </div>
                    <div>
                        <span class="to-from">{{ tx.type === 'receive' ? ' from ' : 'to ' }}</span>
                        <span class="address" (click)="searchService.emitSearch(tx.address)">{{ tx.address }} </span>
                    </div>
                </div>
                <div pxb-subtitle class="hash" (click)="searchService.emitSearch(tx.hash)">{{ tx.hash }}</div>
                <div pxb-right-content class="right-content">
                    <div
                        class="small-monkey"
                        *ngIf="monkeyCache.getMonkey(tx.address) && vp.sm"
                        [innerHTML]="monkeyCache.getMonkey(tx.address) | safe"
                    ></div>
                    <div class="timestamps" [style.marginRight.px]="vp.sm ? 0 : 12">
                        <span>{{ tx.date }}</span>
                        <span>{{ tx.time }}</span>
                    </div>
                </div>
            </pxb-info-list-item>
            <ng-template [ngTemplateOutlet]="paginator"></ng-template>
        </mat-list>

        <pxb-empty-state
            responsive
            *ngIf="confirmedTransactions.length === 0"
            class="account-empty-state"
            title="No Confirmed Transactions"
            description="This account has not received or sent anything yet."
        >
            <mat-icon pxb-empty-icon>paid</mat-icon>
        </pxb-empty-state>
    `,
    styleUrls: ['confirmed-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConfirmedTabComponent {
    @Input() confirmedTransactions: ConfirmedTransaction[];
    @Input() paginator: TemplateRef<PaginatorComponent>;

    constructor(
        public monkeyCache: MonkeyCacheService,
        public searchService: SearchService,
        public vp: ViewportService,
        public util: UtilService
    ) {}

    trackByFn(index: number): number {
        return index;
    }
}
