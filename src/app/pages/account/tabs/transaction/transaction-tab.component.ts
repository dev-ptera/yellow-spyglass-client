import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { Subscription } from 'rxjs';
import { Transaction, TransactionsService } from '@app/services/transactions/transactions.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'account-tx-tab',
    templateUrl: 'transaction-tab.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class TransactionTabComponent implements OnInit, OnDestroy {
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

    isBRPD(): boolean {
        return environment.brpd;
    }

    private _fetchSocialMediaAccounts(transactions: Transaction[]): void {
        if (!this.isBRPD()) {
            return;
        }

        const pageAddressSet = new Set<string>();
        transactions.map((tx) => {
            pageAddressSet.add(tx.address);
        });
        this.aliasService.fetchSocialMediaAliases(pageAddressSet);
    }
}
