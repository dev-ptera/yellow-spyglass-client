import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { PaginatorComponent } from '@app/common/components/paginator/paginator.component';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { TransactionsService } from '@app/pages/account/tabs/transactions/transactions.service';
import { Transaction } from '../transactions/transactions-tab.component';
import { AccountService } from '@app/pages/account/account.service';

export type FilterDialogData = {
    includeReceive: boolean;
    includeSend: boolean;
    includeChange: boolean;
    maxAmount: number;
    minAmount: number;
    filterAddresses: string;
    update?: boolean;
};

@Component({
    selector: 'account-brpd-tab',
    template: `
        <ng-template #transactionPaginator>
            <app-paginator
                *ngIf="blockCount > appliedPageSize && (pageIndex !== 0 || transactions.length >= appliedPageSize)"
                [maxElements]="blockCount"
                [showPageNumberOnly]="true"
                [pageSize]="appliedPageSize"
                [pageIndex]="pageIndex"
                [disableMove]="isLoading"
                (pageIndexChange)="changePage($event)"
            >
            </app-paginator>
        </ng-template>

        <mat-accordion class="mat-elevation-z0">
            <mat-expansion-panel class="mat-elevation-z0">
                <mat-expansion-panel-header>
                    <mat-panel-title>
                        <mat-icon style="margin-right: 12px">tune</mat-icon>
                        Transaction Filters
                    </mat-panel-title>
                </mat-expansion-panel-header>
                <div style="margin: 16px 0">
                    <div style="margin-bottom: 8px">Use the knobs below to filter your transaction history.</div>

                    <div style="display: flex; justify-content: space-between; align-items: center">
                        <mat-chip-list multiple style="display: flex; justify-content: space-between">
                            <mat-chip
                                variant="outline"
                                color="primary"
                                (click)="filterData.includeReceive = !filterData.includeReceive"
                                [selected]="filterData.includeReceive"
                            >
                                <mat-icon matChipAvatar style="font-size: 16px">download</mat-icon>
                                Received
                            </mat-chip>
                            <mat-chip
                                variant="outline"
                                color="primary"
                                (click)="filterData.includeSend = !filterData.includeSend"
                                [selected]="filterData.includeSend"
                            >
                                <mat-icon matChipAvatar style="font-size: 16px">upload</mat-icon>
                                Sent
                            </mat-chip>
                            <mat-chip
                                variant="outline"
                                color="primary"
                                (click)="filterData.includeChange = !filterData.includeChange"
                                [selected]="filterData.includeChange"
                            >
                                <mat-icon matChipAvatar style="font-size: 16px">how_to_vote</mat-icon>
                                Change
                            </mat-chip>
                        </mat-chip-list>
                        <div>
                            <mat-form-field
                                blui-input
                                style="width: 200px; margin-top: 24px; margin-right: 16px"
                                appearance="fill"
                            >
                                <mat-label>Min BAN</mat-label>
                                <input matInput type="number" [(ngModel)]="filterData.minAmount" />
                            </mat-form-field>
                            <mat-form-field blui-input style="width: 200px" appearance="fill">
                                <mat-label>Max BAN</mat-label>
                                <input matInput type="number" [(ngModel)]="filterData.maxAmount" />
                            </mat-form-field>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center">
                        <div>
                            <div class="mat-subheading-2">Page Size ({{ pageSize }})</div>
                            <mat-slider
                                color="accent"
                                style="width: 300px; margin-right: 24px"
                                thumbLabel
                                min="1"
                                max="500"
                                step="1"
                                value="50"
                                [(ngModel)]="pageSize"
                            ></mat-slider>
                        </div>
                        <mat-form-field style="width: 60%" appearance="fill">
                            <mat-label>Filter Addresses</mat-label>
                            <textarea
                                matInput
                                type="text"
                                [(ngModel)]="filterData.filterAddresses"
                                placeholder="address1, address2, etc"
                            ></textarea>
                        </mat-form-field>
                    </div>

                    <button
                        style="width: 150px"
                        mat-flat-button
                        color="primary"
                        (click)="applyFilters()"
                        [disabled]="isLoading"
                    >
                        Apply
                    </button>

                    <button style="width: 150px; margin-left: 24px" (click)="resetFilters()" mat-stroked-button>
                        Reset
                    </button>
                </div>
            </mat-expansion-panel>
        </mat-accordion>
        <mat-divider></mat-divider>
        <ng-container *ngIf="transactions.length !== 0">
            <ng-template [ngTemplateOutlet]="transactionPaginator"></ng-template>
            <mat-divider *ngIf="blockCount > pageSize"></mat-divider>
        </ng-container>
        <div class="brpd-tab-transaction-list">
            <div *ngFor="let tx of transactions; trackBy: trackByFn; let last = last">
                <div style="display: flex; align-items: center">
                    <img
                        [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)"
                        loading="lazy"
                        style="height: 50px; width: 50px; margin-right: 12px;"
                    />
                    <div
                        *ngIf="tx.height"
                        [routerLink]="'/' + navItems.hash.route + '/' + tx.hash"
                        class="link"
                        style="font-family: monospace"
                    >
                        <span style="margin-right: 0px" style="font-size: 14px">#</span
                        >{{ util.numberWithCommas(tx.height) }}
                    </div>
                    <div style="margin: 0 12px">·</div>
                    <blui-list-item-tag
                        style="margin-right: 24px; width: 60px; text-align: center"
                        [label]="tx.type || 'receive'"
                        class="type"
                        [class]="txService.createTagClass(tx, isPending)"
                    ></blui-list-item-tag>

                    <div *ngIf="tx.type !== 'change'" class="amount" style="width: 200px;">
                        {{ tx.type === 'receive' || isPending ? '+' : '-' }}
                        {{ formatNumber(tx.amount) }}
                        BAN
                    </div>
                    <div (mouseenter)="tx.hover = true" (mouseleave)="tx.hover = false">
                        <button
                            mat-icon-button
                            *ngIf="tx.hover"
                            (click)="copy(tx)"
                            style="
                                        cursor: pointer;
                                        height: 24px;
                                        width: 24px;
                                        line-height: 24px;
                                    "
                        >
                            <mat-icon style="font-size: 16px">
                                {{ tx.showCopiedIcon ? 'check_circle' : 'copy_all' }}
                            </mat-icon>
                        </button>
                        <a
                            style="font-family: monospace"
                            class="link text"
                            [routerLink]="'/' + navItems.account.route + '/' + tx.address || tx.newRepresentative"
                        >
                            {{ util.shortenAddress(tx.address || tx.newRepresentative) }}
                        </a>
                    </div>
                    <a
                        style="margin-left: 24px; font-weight: 600; font-size: 14px;"
                        class="link text primary"
                        *ngIf="hasNickname(tx.address || tx.newRepresentative)"
                        [routerLink]="'/' + navItems.account.route + '/' + tx.address || tx.newRepresentative"
                    >
                        {{ aliasService.get(tx.address || tx.newRepresentative) }}
                    </a>
                    <blui-spacer></blui-spacer>
                    <div style="margin-right: 8px">
                        <div style="display: flex; flex-direction: column">
                            <span class="mat-body-2" style="margin-bottom: -0px">{{ dateMap.get(tx.hash).date }}</span>
                            <span
                                class="mat-body-2 text-secondary"
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
                </div>
                <mat-divider></mat-divider>
            </div>

            <ng-container *ngIf="transactions.length !== 0">
                <ng-template [ngTemplateOutlet]="transactionPaginator"></ng-template>
                <mat-divider *ngIf="blockCount > pageSize"></mat-divider>
            </ng-container>
        </div>
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
    styles: [
        `
            textarea:focus,
            input:focus {
                border-radius: 4px;
                border: none !important;
                outline: 0;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class BrpdTabComponent {
    @Input() isPending: boolean;
    @Input() blockCount: number;
    @Input() address: string;
    @Input() paginator: TemplateRef<PaginatorComponent>;

    DEFAULT_PAGE_SIZE = 50;
    pageIndex: number = 0;
    pageSize = this.DEFAULT_PAGE_SIZE;

    appliedPageSize = this.pageSize;
    isLoading: boolean;
    navItems = APP_NAV_ITEMS;

    filterData: FilterDialogData;
    transactions: Transaction[] = [];

    dateMap: Map<string, { date: string; diffDays: number; relativeTime: string }> = new Map();

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService,
        public accountService: AccountService
    ) {}

    ngOnChanges(): void {
        this._loadNewAccount();
    }

    applyFilters(): void {
        this.pageIndex = 0;
        this.appliedPageSize = this.pageSize;
        this.accountService.forgetTransactions();
        this.loadCurrentPage();
    }

    loadCurrentPage(): void {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;

        this.accountService
            .loadTransactionsPage(this.address, this.pageIndex, this.pageSize, this.blockCount, this.filterData)
            .then((data) => {
                this.transactions = data;
                this.txService.createDateMap(this.transactions, this.dateMap);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    copy(item: any): void {
        void navigator.clipboard.writeText(item.address || item.newRepresentative);
        item.showCopiedIcon = true;
        setTimeout(() => {
            item.showCopiedIcon = false;
        }, 700);
    }

    resetFilters(): void {
        this.pageSize = this.DEFAULT_PAGE_SIZE;
        this.filterData = {
            includeReceive: true,
            includeChange: true,
            includeSend: true,
            maxAmount: undefined,
            minAmount: undefined,
            filterAddresses: '',
        };
    }

    fetchRemoteNicknames(): void {
        const noAlias = new Set<string>();
        this.transactions.map((tx) => {
            if (!this.aliasService.has(tx.address)) {
                noAlias.add(tx.address);
            }
        });

        const tipBot = [];
        Array.from(noAlias).map((address) => {
            //   tipBot.push(this.apiService.fetchTipbotNickname(address));
        });

        Promise.all(tipBot)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    hasNickname(address: string): boolean {
        return this.aliasService.has(address);
    }

    trackByFn(index: number): number {
        return index;
    }

    formatNumber(x: number): string {
        if (isNaN(x)) {
            return;
        }
        return this.util.numberWithCommas(Number(x.toFixed(4)));
    }

    /** Move the pagination logic into this page. */
    changePage(page: number): void {
        this.pageIndex = page;
        this.loadCurrentPage();
    }

    private _loadNewAccount(): void {
        this.pageIndex = 0;
        this.transactions = [];
        this.accountService.forgetTransactions();
        this.resetFilters();
        this.loadCurrentPage();
    }
}
