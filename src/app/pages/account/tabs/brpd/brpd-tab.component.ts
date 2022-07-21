import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { Transaction, TransactionsService } from '@app/pages/account/tabs/transactions/transactions.service';

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
    styleUrls: ['brpd-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BrpdTabComponent {
    @Input() isPending: boolean;
    @Input() blockCount: number;
    @Input() address: string;

    DEFAULT_PAGE_SIZE = 50;
    pageIndex = 0;
    pageSize = this.DEFAULT_PAGE_SIZE;

    hasFiltersApplied: boolean;

    appliedPageSize = this.pageSize;
    isLoading: boolean;
    navItems = APP_NAV_ITEMS;

    filterData: FilterDialogData;
    displayedTransactions: Transaction[] = [];

    dateMap: Map<string, { date: string; diffDays: number; relativeTime: string }> = new Map();

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService
    ) {}

    ngOnInit(): void {
        if (this.isPending) {
            this.displayedTransactions = this.txService.receivableTransactions;
            this.txService.createDateMap(this.displayedTransactions, this.dateMap);
            this.fetchSocialMediaAccounts(this.displayedTransactions);
        } else {
            this._loadNewAccount();
            this.loadConfirmedTransactionsPage();
        }
    }

    applyFilters(): void {
        this.pageIndex = 0;
        this.appliedPageSize = this.pageSize;
        this.displayedTransactions = [];
        this.txService.forgetConfirmedTransactions();
        this.hasFiltersApplied = false;
        this.hasFiltersApplied ||= Boolean(this.filterData.maxAmount);
        this.hasFiltersApplied ||= Boolean(this.filterData.minAmount);
        this.hasFiltersApplied ||= Boolean(this.filterData.filterAddresses);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeSend);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeChange);
        this.hasFiltersApplied ||= Boolean(!this.filterData.includeReceive);
        this.loadConfirmedTransactionsPage();
    }

    loadConfirmedTransactionsPage(): void {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this.txService
            .loadConfirmedTransactionsPage(
                this.address,
                this.pageIndex,
                this.pageSize,
                this.blockCount,
                this.hasFiltersApplied ? this.filterData : undefined
            )
            .then((data) => {
                this.displayedTransactions = data;
                this.txService.createDateMap(this.displayedTransactions, this.dateMap);
                this.fetchSocialMediaAccounts(data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    fetchSocialMediaAccounts(transactions: Transaction[]): void {
        const pageAddressSet = new Set<string>();
        transactions.map((tx) => {
            pageAddressSet.add(tx.address);
        });
        this.aliasService.fetchSocialMediaAliases(pageAddressSet);
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
        this.loadConfirmedTransactionsPage();
    }

    private _loadNewAccount(): void {
        this.pageIndex = 0;
        this.displayedTransactions = [];
        this.resetFilters();
        this.loadConfirmedTransactionsPage();
    }
}
