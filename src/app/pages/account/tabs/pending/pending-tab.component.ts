import { Component, Input, ViewEncapsulation } from '@angular/core';
import { PendingTransaction } from '@app/types/modal/PendingTransactionDto';
import { MonkeyCacheService } from '@app/services/monkey-cache/monkey-cache.service';
import { SearchService } from '@app/services/search/search.service';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'account-pending-tab',
    template: `
        <mat-divider></mat-divider>

        <mat-list class="tab-transaction-list" *ngIf="pendingTransactions.length >= 0" responsive>
            <pxb-info-list-item
                *ngFor="let tx of pendingTransactions; trackBy: trackByFn"
                [divider]="true"
                [wrapTitle]="true"
                [wrapSubtitle]="false"
                [hidePadding]="true"
                style="position: relative"
            >
                <div class="large-monkey-wrapper" pxb-icon>
                    <div
                        *ngIf="monkeyCache.getMonkey(tx.address)"
                        [innerHTML]="monkeyCache.getMonkey(tx.address) | safe"
                    ></div>
                </div>
                <div pxb-title>
                    <div class="tag-row">
                        <pxb-list-item-tag label="receive" class="type receive"></pxb-list-item-tag>
                        <span class="amount receive">{{ tx.balance }}</span>
                    </div>
                    <div>
                        <span class="to-from">from</span>
                        <span class="address link" (click)="searchService.emitSearch(tx.address)">
                            {{ ' ' + tx.address }}
                        </span>
                    </div>
                </div>
                <div pxb-subtitle class="hash">
                    <span class="link" (click)="searchService.emitSearch(tx.hash)">{{ tx.hash }}</span>
                </div>
                <div pxb-right-content class="right-content">
                    <div
                        class="small-monkey"
                        *ngIf="monkeyCache.getMonkey(tx.address) && vp.sm"
                        [innerHTML]="monkeyCache.getMonkey(tx.address) | safe"
                    ></div>
                    <div class="timestamps">
                        <span>{{ tx.date }}</span>
                        <span>{{ tx.time }}</span>
                    </div>
                </div>
            </pxb-info-list-item>
        </mat-list>

        <!--
        <div style="text-align: center; margin-top: 16px" *ngIf="pendingTxCount > shownPendingTransactions">
            <button color="primary" style="padding: 8px 16px" mat-stroked-button (click)="fetchMorePending()">
                Load more
            </button>
        </div>
        -->

        <pxb-empty-state
            responsive
            class="account-empty-state"
            *ngIf="pendingTransactions.length === 0"
            title="No Pending Transactions"
            description="This account has already received all pending payments"
        >
            <mat-icon pxb-empty-icon>paid</mat-icon>
        </pxb-empty-state>
    `,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../confirmed/confirmed-tab.component.scss'],
})
export class PendingTabComponent {
    @Input() pendingTransactions: PendingTransaction[];
    @Input() pendingTxCount: number;

    shownPendingTransactions = 50;
    constructor(
        public monkeyCache: MonkeyCacheService,
        public searchService: SearchService,
        public vp: ViewportService
    ) {}

    trackByFn(index: number): number {
        return index;
    }

    fetchMorePending(): void {
        this.shownPendingTransactions += 50;
    }
}