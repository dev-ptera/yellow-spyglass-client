import {Component, Input, TemplateRef, ViewEncapsulation} from '@angular/core';
import {SearchService} from '@app/services/search/search.service';
import {ViewportService} from '@app/services/viewport/viewport.service';
import {PaginatorComponent} from '@app/common/components/paginator/paginator.component';
import {UtilService} from '@app/services/util/util.service';
import {AliasService} from '@app/services/alias/alias.service';
import {ConfirmedTransactionDto} from '@app/types/dto';
import {ApiService} from "@app/services/api/api.service";

@Component({
    selector: 'account-confirmed-tab',
    template: `
        <ng-template [ngTemplateOutlet]="paginator"></ng-template>
        <mat-divider></mat-divider>

        <mat-list class="tab-transaction-list" *ngIf="confirmedTransactions.length >= 0" responsive>
            <blui-info-list-item
                *ngFor="let tx of confirmedTransactions; trackBy: trackByFn; let last = last"
                [divider]="last ? undefined :'full'"
                [wrapTitle]="true"
                [wrapSubtitle]="false"
                [hidePadding]="true"
                style="position: relative"
            >
                <div blui-icon>
                    <img [src]="apiService.createMonKeyUrl(tx.address)" loading="lazy" />
                </div>
                <div blui-title>
                    <div class="tag-row">
                        <span class="mat-body-2" style="margin-right: 8px"># {{tx.height}}</span>
                        <blui-list-item-tag [label]="tx.type" [class]="'type ' + tx.type"></blui-list-item-tag>
                        <span *ngIf="tx.type !== 'change'" [class]="'amount ' + tx.type">{{ tx.amount }}</span>
                    </div>
                    <div>
                        <span class="to-from">{{ tx.type === 'receive' ? ' from ' : 'to ' }}</span>
                        <span class="address link" (click)="searchService.emitSearch(tx.address, $event.ctrlKey)"
                            >{{ aliasService.get(tx.address) || tx.address }}
                        </span>
                    </div>
                </div>
                <div blui-subtitle class="hash">
                    <span class="link text-hint" (click)="searchService.emitSearch(tx.hash, $event.ctrlKey)">{{ tx.hash }}</span>
                </div>
                <div blui-right-content class="right-content">
                    <div *ngIf="vp.sm"
                        class="small-monkey">
                        <img [src]="apiService.createMonKeyUrl(tx.address)" loading="lazy" />
                    </div>
                    <div class="timestamps" [style.marginRight.px]="vp.sm ? 0 : 12">
                        <span class="mat-body-2">{{ tx.date }}</span>
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
    @Input() confirmedTransactions: ConfirmedTransactionDto[];
    @Input() paginator: TemplateRef<PaginatorComponent>;

    constructor(
        public aliasService: AliasService,
        public apiService: ApiService,
        public searchService: SearchService,
        public vp: ViewportService,
        public util: UtilService
    ) {}

    trackByFn(index: number): number {
        return index;
    }
}
