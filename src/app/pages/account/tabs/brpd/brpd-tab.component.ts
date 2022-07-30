import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { Transaction, TransactionsService } from '@app/pages/account/tabs/transactions/transactions.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'account-brpd-tab',
    templateUrl: 'brpd-tab.component.html',
    styleUrls: ['brpd-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BrpdTabComponent implements OnInit, OnDestroy {
    @Input() address: string;
    @Input() isPending: boolean;
    @Input() blockCount: number;

    pageIndex = 0;
    pageSize: number;
    navItems = APP_NAV_ITEMS;
    pageLoad$: Subscription;

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService
    ) {}

    ngOnInit(): void {
        this.fetchSocialMediaAccounts(this.txService.confirmedTransactions.display);
        this.pageLoad$ = this.txService.emitPageLoad().subscribe((data) => {
             this.fetchSocialMediaAccounts(data);
        });

        /*

        if (this.isPending) {
            this.displayedTransactions = this.txService.receivableTransactions;
            this.txService.createDateMap(this.displayedTransactions, this.dateMap);
            this.fetchSocialMediaAccounts(this.displayedTransactions);
        } else {
            this._loadNewAccount();
            this.loadConfirmedTransactionsPage();
        } */

        this.aliasService.fetchSocialMediaAliases(new Set([this.address]));
    }

    ngOnDestroy(): void {
        if (this.pageLoad$) {
            this.pageLoad$.unsubscribe();
        }
    }

    enableFastForward(): boolean {
        return !this.txService.hasFiltersApplied();
    }

    loadConfirmedTransactionsPage(): void {
        const pageSize = this.txService.filterData.size;
        this.txService.loadConfirmedTransactionsPage(this.pageIndex, pageSize).catch((err) => {
            console.error(err);
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

    getDisplayedTransactions(): Transaction[] {
        if (this.isPending) {
            return this.txService.receivableTransactions;
        }
        return this.txService.confirmedTransactions.display;
    }

    /** Move the pagination logic into this page. */
    changePage(page: number): void {
        this.pageIndex = page;
        this.loadConfirmedTransactionsPage();
    }

    showLoadingEmptyState(): boolean {
        return this.isPending ?
            this.txService.isLoadingReceivableTransactions :
            this.txService.isLoadingConfirmedTransactions && this.txService.confirmedTransactions.display.length === 0;
    }

    isLoading(): boolean {
        return this.isPending ?
            this.txService.isLoadingReceivableTransactions :
            this.txService.isLoadingConfirmedTransactions;
    }

    showPaginator(): boolean {
        return this.blockCount > this.txService.filterData.size;
    }
}
