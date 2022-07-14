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
    templateUrl: 'brpd-tab.component.html',
    styles: [
        `
            .social-media-button {
                cursor: pointer;
                height: 24px;
                width: 24px;
                line-height: unset;
                margin-right: 4px;
            }
            .social-media-button .mat-button-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .social-media-icon {
                width: 14px;
                line-height: 24px;
                opacity: 0.75;
            }
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
    pageIndex = 0;
    pageSize = this.DEFAULT_PAGE_SIZE;

    hasFiltersApplied: boolean;

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
        this.hasFiltersApplied = false;
        this.hasFiltersApplied ||= Boolean(this.filterData.maxAmount);
        this.hasFiltersApplied ||= Boolean(this.filterData.minAmount);
        this.hasFiltersApplied ||= Boolean(this.filterData.filterAddresses);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeSend);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeChange);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeReceive);
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
                const pageAddressSet = new Set<string>();
                data.map((tx) => {
                    pageAddressSet.add(tx.address);
                });
                this.aliasService.fetchSocialMediaAliases(pageAddressSet);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    copyAddress(item: Transaction): void {
        void navigator.clipboard.writeText(item.address || item.newRepresentative);
        item.showCopiedAddressIcon = true;
        setTimeout(() => {
            item.showCopiedAddressIcon = false;
        }, 700);
    }

    copyPlatformUserId(item: Transaction): void {
        const discordId = this.aliasService.getSocialMediaUserId(item.address || item.newRepresentative);
        void navigator.clipboard.writeText(String(discordId));
        item.showCopiedPlatformIdIcon = true;
        setTimeout(() => {
            item.showCopiedPlatformIdIcon = false;
        }, 700);
    }

    resetFilters(): void {
        this.pageSize = this.DEFAULT_PAGE_SIZE;
        this.hasFiltersApplied = false;
        this.filterData = {
            includeReceive: true,
            includeChange: true,
            includeSend: true,
            maxAmount: undefined,
            minAmount: undefined,
            filterAddresses: '',
        };
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
