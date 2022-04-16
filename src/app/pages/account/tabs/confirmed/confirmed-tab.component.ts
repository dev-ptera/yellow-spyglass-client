import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ConfirmedTransaction } from '@app/types/modal/ConfirmedTransaction';
import { MonkeyCacheService } from '@app/services/monkey-cache/monkey-cache.service';
import { SearchService } from '@app/services/search/search.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { PaginatorComponent } from '@app/common/components/paginator/paginator.component';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';

@Component({
    selector: 'account-confirmed-tab',
    template: `
        <ng-template [ngTemplateOutlet]="paginator"></ng-template>
        <mat-divider></mat-divider>

        <mat-list class="tab-transaction-list" *ngIf="confirmedTransactions.length >= 0" responsive>
            <blui-info-list-item
                *ngFor="let tx of confirmedTransactions; trackBy: trackByFn; let last = last"
                [divider]="last ? undefined : vp.sm ? 'full' : 'partial'"
                [wrapTitle]="true"
                [wrapSubtitle]="false"
                [hidePadding]="true"
                style="position: relative"
            >
                <div blui-icon>
                    <div
                        *ngIf="monkeyCache.getMonkey(tx.address)"
                        [innerHTML]="monkeyCache.getMonkey(tx.address) | safe"
                    ></div>
                </div>
                <div blui-title>
                    <div class="tag-row">
                        <blui-list-item-tag [label]="tx.formatHeight" [class]="'height ' + tx.type"></blui-list-item-tag>
                        <blui-list-item-tag [label]="tx.type" [class]="'type ' + tx.type"></blui-list-item-tag>
                        <span *ngIf="tx.type !== 'change'" [class]="'amount ' + tx.type">{{ tx.balance }}</span>
                    </div>
                    <div>
                        <span class="to-from">{{ tx.type === 'receive' ? ' from ' : 'to ' }}</span>
                        <span class="address link" (click)="searchService.emitSearch(tx.address, $event.ctrlKey)"
                            >{{ aliasService.get(tx.address) || tx.address }}
                        </span>
                    </div>
                </div>
                <div blui-subtitle class="hash">
                    <span class="link" (click)="searchService.emitSearch(tx.hash, $event.ctrlKey)">{{ tx.hash }}</span>
                </div>
                <div blui-right-content class="right-content">
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
            </blui-info-list-item>
            <mat-divider></mat-divider>
            <ng-template [ngTemplateOutlet]="paginator"></ng-template>
        </mat-list>

        <blui-empty-state
            responsive
            *ngIf="confirmedTransactions.length === 0"
            class="account-empty-state"
            title="No Confirmed Transactions"
            description="This account has not received or sent anything yet."
        >
            <mat-icon blui-empty-icon>paid</mat-icon>
        </blui-empty-state>
    `,
    styleUrls: ['confirmed-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConfirmedTabComponent {
    @Input() confirmedTransactions: ConfirmedTransaction[];
    @Input() paginator: TemplateRef<PaginatorComponent>;

    constructor(
        public aliasService: AliasService,
        public monkeyCache: MonkeyCacheService,
        public searchService: SearchService,
        public vp: ViewportService,
        public util: UtilService
    ) {}

    trackByFn(index: number): number {
        return index;
    }
}
