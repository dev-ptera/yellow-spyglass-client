import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { PaginatorComponent } from '@app/common/components/paginator/paginator.component';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { TransactionsService } from '@app/pages/account/tabs/transactions/transactions.service';

export type Transaction = {
    timestampHovered?: boolean;
    amount?: number;
    hash: string;
    type?: 'receive' | 'send' | 'change';
    height?: number;
    address?: string;
    timestamp: number;
    newRepresentative?: string;
};

@Component({
    selector: 'account-tx-tab',
    template: `
        <ng-container *ngIf="transactions.length !== 0">
            <ng-template [ngTemplateOutlet]="paginator"></ng-template>
            <mat-divider *ngIf="blockCount > txPerPage"></mat-divider>
        </ng-container>
        <mat-list class="tab-transaction-list" *ngIf="transactions.length >= 0" responsive>
            <blui-info-list-item
                *ngFor="let tx of transactions; trackBy: trackByFn; let last = last"
                [divider]="last ? undefined : 'full'"
                [wrapTitle]="true"
                [wrapSubtitle]="false"
                [hidePadding]="true"
                style="position: relative"
            >
                <div blui-icon>
                    <img
                        [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)"
                        loading="lazy"
                        style="margin-right: 8px"
                    />
                </div>
                <div blui-left-content [style.width.px]="vp.sm ? 64 : 72" style="justify-content: left">
                    <blui-list-item-tag
                        [label]="tx.type || 'receive'"
                        class="type"
                        [class]="txService.createTagClass(tx, isPending)"
                    ></blui-list-item-tag>
                </div>
                <div blui-title>
                    <div class="tag-row">
                        <span *ngIf="tx.type !== 'change'" class="amount">
                            {{ tx.type === 'receive' || isPending ? '+' : '-' }}
                            {{ util.numberWithCommas(tx.amount) }}
                        </span>
                    </div>
                    <div class="address-row">
                        <ng-container *ngIf="!tx.type || tx.type === 'receive'">
                            <span class="to-from text-secondary">from</span>
                            <span>
                                <a
                                    class="address link text"
                                    [routerLink]="'/' + navItems.account.route + '/' + tx.address"
                                    >{{ aliasService.get(tx.address) || tx.address }}</a
                                >
                            </span>
                        </ng-container>

                        <ng-container *ngIf="tx.type === 'send'">
                            <span class="to-from text-secondary">to</span>
                            <span>
                                <a
                                    class="address link text"
                                    [routerLink]="'/' + navItems.account.route + '/' + tx.address"
                                    >{{ aliasService.get(tx.address) || tx.address }}
                                </a>
                            </span>
                        </ng-container>

                        <ng-container *ngIf="tx.type === 'change'">
                            <span class="to-from text-secondary">to</span>
                            <span
                                ><a
                                    class="address link text"
                                    [routerLink]="'/' + navItems.account.route + '/' + tx.newRepresentative"
                                    >{{ aliasService.get(tx.newRepresentative) || tx.newRepresentative }}</a
                                >
                            </span>
                        </ng-container>
                    </div>
                </div>
                <div blui-subtitle class="hash text-hint mat-body-2">
                    <span *ngIf="tx.height">
                        <span style="margin-right: 0px">#</span>{{ util.numberWithCommas(tx.height) }}</span
                    >
                    <span style="margin: 0 4px" *ngIf="tx.height">·</span>
                    <a class="link hash text-hint" [routerLink]="'/' + navItems.hash.route + '/' + tx.hash"
                        >{{ tx.hash }}
                    </a>
                </div>
                <div blui-right-content class="right-content" [style.marginRight.px]="vp.sm ? 0 : 8">
                    <div *ngIf="vp.sm" class="small-monkey">
                        <img [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)" loading="lazy" />
                    </div>
                    <div class="timestamps">
                        <span class="mat-body-2">{{ dateMap.get(tx.hash).date }}</span>
                        <span
                            class="mat-body-2 text-secondary"
                            [style.fontSize.px]="vp.sm ? 12 : 14"
                            (mouseenter)="tx.timestampHovered = true"
                            (mouseleave)="tx.timestampHovered = false"
                        >
                            <ng-container *ngIf="!tx.timestampHovered">
                                {{ dateMap.get(tx.hash).relativeTime }}
                            </ng-container>
                            <ng-container *ngIf="tx.timestampHovered">
                                {{ txService.getTime(tx.timestamp) }}
                            </ng-container>
                        </span>
                    </div>
                </div>
            </blui-info-list-item>
            <ng-container *ngIf="transactions.length !== 0">
                <mat-divider *ngIf="blockCount > txPerPage"></mat-divider>
                <ng-template [ngTemplateOutlet]="paginator"></ng-template>
            </ng-container>
        </mat-list>

        <div *ngIf="transactions.length === 0" class="tab-empty-state">
            <blui-empty-state
                responsive
                class="account-empty-state"
                [title]="txService.getEmptyStateTitle(isPending)"
                [description]="txService.getEmptyStateDescription(isPending)"
            >
                <mat-icon blui-empty-icon>paid</mat-icon>
            </blui-empty-state>
        </div>
    `,
    styleUrls: ['transactions-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TransactionsTabComponent {
    @Input() transactions: Transaction[];
    @Input() isPending: boolean;
    @Input() paginator: TemplateRef<PaginatorComponent>;
    @Input() blockCount: number;
    @Input() txPerPage: number;

    navItems = APP_NAV_ITEMS;
    dateMap: Map<string, { date: string; diffDays: number; relativeTime: string }> = new Map();

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService
    ) {}

    ngOnChanges(): void {
        this.txService.createDateMap(this.transactions, this.dateMap);
    }

    trackByFn(index: number): number {
        return index;
    }
}
