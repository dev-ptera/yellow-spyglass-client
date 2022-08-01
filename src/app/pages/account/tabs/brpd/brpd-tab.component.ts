import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { Subscription } from 'rxjs';
import {Transaction, TransactionsService} from "@app/services/transactions/transactions.service";

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

    hasError: boolean;

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService
    ) {}

    ngOnInit(): void {
        // Fetch the alias for the displayed account.
        this.aliasService.fetchSocialMediaAliases(new Set([this.address]));

        // Listen for page change events & fetch social media accounts as required.
        this.pageLoad$ = this.txService.emitPageLoad().subscribe((data) => {
            this._fetchSocialMediaAccounts(data);
            this.pageIndex = this.txService.confirmedTransactions.currentPage;
        });

        // On load, fetch social media accounts.
        if (this.isPending) {
            this._fetchSocialMediaAccounts(this.txService.receivableTransactions);
        } else {
            this._fetchSocialMediaAccounts(this.txService.confirmedTransactions.display);
        }
    }

    ngOnDestroy(): void {
        if (this.pageLoad$) {
            this.pageLoad$.unsubscribe();
        }
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

    trackByFn(index: number, tx: Transaction): number {
        return tx.height;
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

    showLoadingEmptyState(): boolean {
        return this.isPending
            ? this.txService.isLoadingReceivableTransactions
            : this.txService.isLoadingConfirmedTransactions &&
                  this.txService.confirmedTransactions.display.length === 0;
    }

    isLoading(): boolean {
        return this.isPending
            ? this.txService.isLoadingReceivableTransactions
            : this.txService.isLoadingConfirmedTransactions;
    }

    private _fetchSocialMediaAccounts(transactions: Transaction[]): void {
        const pageAddressSet = new Set<string>();
        transactions.map((tx) => {
            pageAddressSet.add(tx.address);
        });
        this.aliasService.fetchSocialMediaAliases(pageAddressSet);
    }
}
