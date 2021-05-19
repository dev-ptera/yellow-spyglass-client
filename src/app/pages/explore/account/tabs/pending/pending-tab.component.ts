import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewEncapsulation,
} from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ConfirmedTransaction } from '@app/types/modal/ConfirmedTransaction';
import { PendingTransaction } from '@app/types/modal/PendingTransactionDto';

@Component({
    selector: 'account-pending-tab',
    template: `
        <mat-list class="tab-transaction-list">
            <pxb-info-list-item
                *ngFor="let tx of pendingTransactions; trackBy: trackByFn"
                [divider]="true"
                [wrapTitle]="true"
                [wrapSubtitle]="false"
                style="background-color: white; position: relative"
            >
                <div pxb-icon>
                    <div *ngIf="monkeySvg" [innerHTML]="monkeySvg | safe"></div>
                </div>
                <div pxb-title>
                    <div>
                        <pxb-list-item-tag [label]="'receive'" class="type receive"></pxb-list-item-tag>
                        <span class="amount receive">{{ tx.balance }}</span>
                    </div>
                    <div>
                        <span class="to-from">from</span>
                        <span class="address" (click)="search.emit(tx.address)">
                            {{ ' ' + tx.address }}
                        </span>
                    </div>
                </div>
                <div pxb-subtitle class="hash">{{ tx.hash }}</div>
            </pxb-info-list-item>
        </mat-list>

        <pxb-empty-state
            class="account-empty-state"
            *ngIf="pendingTransactions.length === 0"
            title="No Pending Transactions"
            description="This account has already received all pending payments"
        >
            <mat-icon pxb-empty-icon>paid</mat-icon>
        </pxb-empty-state>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../confirmed/confirmed-tab.component.scss'],
})
export class PendingTabComponent {
    @Input() pendingTransactions: PendingTransaction[];
    @Input() paginator: TemplateRef<any>;

    @Output() search: EventEmitter<string> = new EventEmitter<string>();

    constructor(public vp: ViewportService) {}

    trackByFn(index) {
        return index;
    }
}
