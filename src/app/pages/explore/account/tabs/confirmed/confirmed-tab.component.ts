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

@Component({
    selector: 'account-confirmed-tab',
    template: `
        <ng-template [ngTemplateOutlet]="paginator"></ng-template>
        <mat-divider></mat-divider>

        <mat-list class="tab-transaction-list" *ngIf="confirmedTransactions.length >= 0">
            <pxb-info-list-item
                *ngFor="let tx of confirmedTransactions; trackBy: trackByFn"
                [divider]="true"
                [wrapTitle]="true"
                [wrapSubtitle]="false"
                [hidePadding]="true"
                style="background-color: #fdfdfd; position: relative"
            >
                <div pxb-icon *ngIf="!vp.sm">
                    <!--<div *ngIf="monkeySvg" [innerHTML]="monkeySvg | safe"></div>-->
                </div>
                <div pxb-title>
                    <div>
                        <pxb-list-item-tag [label]="tx.formatHeight" [class]="'height ' + tx.type"></pxb-list-item-tag>
                        <pxb-list-item-tag [label]="tx.type" [class]="'type ' + tx.type"></pxb-list-item-tag>
                        <span *ngIf="tx.type !== 'change'" [class]="'amount ' + tx.type">{{ tx.balance }}</span>
                    </div>
                    <div>
                        <span class="to-from">{{ tx.type === 'receive' ? ' from' : 'to' }}</span>
                        <span class="address" (click)="search.emit(tx.address)">
                            {{ ' ' + tx.address }}
                        </span>
                    </div>
                </div>
                <div pxb-subtitle class="hash">{{ tx.hash }}</div>
                <div pxb-right-content>
                    <div class="timestamps" responsive>
                        <span>{{ tx.date }}</span>
                        <span>{{ tx.time }}</span>
                    </div>
                </div>
            </pxb-info-list-item>
            <ng-template [ngTemplateOutlet]="paginator"></ng-template>
        </mat-list>

        <pxb-empty-state
            *ngIf="confirmedTransactions.length === 0"
            class="account-empty-state"
            title="No Confirmed Transactions"
            description="This account has not received or sent anything yet."
        >
            <mat-icon pxb-empty-icon>paid</mat-icon>
        </pxb-empty-state>
    `,
    styleUrls: ['confirmed-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ConfirmedTabComponent {
    @Input() confirmedTransactions: ConfirmedTransaction[];
    @Input() paginator: TemplateRef<any>;

    @Output() search: EventEmitter<string> = new EventEmitter<string>();

    constructor(public vp: ViewportService) {}

    trackByFn(index) {
        return index;
    }
}
