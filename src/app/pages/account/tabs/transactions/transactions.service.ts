import { Injectable } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { ConfirmedTransactionDto } from '@app/types/dto';
import { Observable, Subject, Subscription } from 'rxjs';

export type Transaction = {
    timestampHovered?: boolean;
    amount?: number;
    hash: string;
    type?: 'receive' | 'send' | 'change';
    height?: number;
    address?: string;
    timestamp: number;
    newRepresentative?: string;
    showCopiedAddressIcon?: boolean;
    hoverPlatform?: boolean;
    hoverAddress?: boolean;
    showCopiedPlatformIdIcon?: boolean;
};

export type FilterDialogData = {
    includeReceive: boolean;
    includeSend: boolean;
    includeChange: boolean;
    maxAmount: number;
    minAmount: number;
    maxBlock: number;
    minBlock: number;
    filterAddresses: string;
    update?: boolean;
    size: number;
    excludedAddresses: string;
    reverse: boolean;
    showKnownAccounts: boolean;
};

@Injectable({
    providedIn: 'root',
})
/** This class handles data transformations for the transactions list. */
export class TransactionsService {
    maxPageLoaded: number;

    isLoadingConfirmedTransactions: boolean;
    isLoadingReceivableTransactions: boolean;
    filterData: FilterDialogData;

    confirmedTransactions: {
        all: Map<number, Transaction[]>;
        display: Transaction[];
    };

    receivableTransactions: Transaction[];

    // Map hashes to dates and relative timestamps.
    dateMap: Map<string, { date: string; diffDays: number; relativeTime: string }> = new Map();

    /* Private */
    private readonly pageLoad$ = new Subject<Transaction[]>();

    /* These fields need to be populated when an account is loaded for the first time. */
    address: string;
    private blockCount: number;

    accountOverviewListener: Subscription;

    constructor(private readonly _vp: ViewportService, private readonly _apiService: ApiService) {
        this.forgetAccount();

        this.accountOverviewListener = this._apiService.accountLoadedSubject.subscribe((overview) => {
            this.address = overview.address;
            this.blockCount = overview.blockCount;
        });
    }

    emitPageLoad(): Observable<Transaction[]> {
        return this.pageLoad$;
    }

    loadReceivableTransactions(address: string): Promise<void> {
        if (this.isLoadingReceivableTransactions) {
            return;
        }

        this.isLoadingReceivableTransactions = true;
        return new Promise(() => {
            this._apiService
                .fetchReceivableTransactions(address)
                .then((data) => {
                    this.receivableTransactions = data;
                    this.updateDateMap(data, this.dateMap);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.isLoadingReceivableTransactions = false;
                });
        });
    }

    private _onFetchPage(data: Transaction[], page: number): void {
        this.confirmedTransactions.display = data;
        this.isLoadingConfirmedTransactions = false;
        this.updateDateMap(data, this.dateMap);
        this.confirmedTransactions.all.set(page, data);
        if (page >= this.maxPageLoaded) {
            this.maxPageLoaded = page;
        }
        this.pageLoad$.next(data);
    }

    /** Checks if we have historically loaded the page.  If we have, display it.
     * It otherwise fetches the page remotely. */
    async loadConfirmedTransactionsPage(page: number, pageSize: number): Promise<void> {

        if (!this.address) {
            console.error('No address has been specified in search');
        }

        // If we have previously loaded the page, return the page.
        if (this.confirmedTransactions.all.has(page)) {
            const data = this.confirmedTransactions.all.get(page);
            return this._onFetchPage(data, page);
        }

        // Do not double-load.
        if (this.isLoadingConfirmedTransactions) {
            return;
        }

        this.isLoadingConfirmedTransactions = true;

        let offset = 0;


        if (this.hasFiltersApplied()) {
            try {
                // Get the offset based on the height of the last-loaded transaction.
                const displayed = this.confirmedTransactions.display;
                offset = this.blockCount - displayed[displayed.length - 1].height + 1;
            } catch (err) {
                //  console.error(err);
            }
        } else {
            offset = page * pageSize;
        }

        try {
            //  this.confirmedTransactions.display = [];
            const data = (await this._apiService.fetchConfirmedTransactions(
                this.address,
                pageSize,
                offset,
                this.filterData
            )) as Transaction[];
            this._onFetchPage(data, page);
        } catch (err) {
            this.isLoadingConfirmedTransactions = false;
            console.error(err);
        }
    }

    getEmptyStateTitle(isPending: boolean): string {
        if (isPending) {
            return 'No Pending Transactions';
        }
        return 'No Confirmed Transactions';
    }

    getEmptyStateDescription(isPending: boolean): string {
        if (isPending) {
            return 'This account has already received all incoming payments.';
        }
        return 'This account has not received or sent anything yet.';
    }

    /** Populates map of hash->date info */
    updateDateMap(
        transactions: Transaction[],
        dateMap: Map<string, { date: string; diffDays: number; relativeTime: string }>
    ): void {
        const currentDate = new Date().getTime() / 1000;
        const oneDay = 24 * 60 * 60; // hours*minutes*seconds*milliseconds
        transactions.map((tx) => {
            const diffDays = tx.timestamp
                ? Math.round(((currentDate - tx.timestamp) / oneDay) * 1000) / 1000
                : undefined;
            dateMap.set(tx.hash, {
                date: this._formatDateString(tx.timestamp),
                diffDays,
                relativeTime: this.getRelativeTime(diffDays),
            });
        });
    }

    /** Converts timestamp to local time (e.g. 05:32:19 AM) . */
    getTime(timestamp: number): string {
        if (timestamp) {
            return new Date(timestamp * 1000).toLocaleTimeString();
        }
    }

    /** Given a number of days, returns a string representation of time (e.g 3 weeks ago). */
    getRelativeTime(days: number): string {
        if (!days) {
            return '';
        }

        if (days > 365) {
            const years = Math.round(days / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
        if (days > 30) {
            const months = Math.round(days / 30);
            return `${months} ${this._vp.sm ? 'mo' : 'month'}${months > 1 ? 's' : ''} ago`;
        }
        if (days > 7) {
            const weeks = Math.round(days / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
        if (days >= 1) {
            const rounded = Math.round(days);
            return `${rounded} day${rounded > 1 ? 's' : ''} ago`;
        }
        if (days < 1) {
            const hours = days * 24;
            if (hours > 1) {
                const roundedHours = Math.round(hours);
                return `${roundedHours} hour${roundedHours > 1 ? 's' : ''} ago`;
            }
            const roundedMinutes = Math.round(hours * 60);
            return `${roundedMinutes} ${this._vp.sm ? 'min' : 'minute'}${roundedMinutes > 1 ? 's' : ''} ago`;
        }
    }

    /** Creates a css class for each transactions' SEND/RECEIVE/CHANGE tag. */
    createTagClass(tx: Transaction, isPending: boolean): string {
        if (isPending) {
            return 'receive';
        }
        return tx.type;
    }

    /** Removes all stored information for an account. Confirmed/Receivable Transactions & Current Page number (confirmed) */
    forgetAccount(): void {
        this.maxPageLoaded = 0;
        this.address = undefined;
        this.blockCount = undefined;
        this.dateMap.clear();
        this.receivableTransactions = [];
        this.confirmedTransactions = {
            all: new Map<number, ConfirmedTransactionDto[]>(),
            display: [],
        };
    }

    forgetConfirmedTransactions(): void {
        this.maxPageLoaded = 0;
        this.dateMap.clear();
        this.confirmedTransactions = {
            all: new Map<number, ConfirmedTransactionDto[]>(),
            display: [],
        };
    }

    /** Given a timestamp, returns a date (e.g 10/08/2022) */
    private _formatDateString(timestamp: number): string {
        if (!timestamp) {
            return 'Unknown';
        }

        const date = new Date(timestamp * 1000);
        return `${date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}/${
            date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
        }/${this._vp.sm ? date.getFullYear().toString().substring(2, 4) : `${date.getFullYear()}`}`;
    }

    setFilters(filters: FilterDialogData): void {
        this.filterData = Object.assign({}, filters);
    }

    /** Returns true if there are filters that prevent blocks from showing in the list.  Omits 'reverse' */
    hasFiltersApplied(): boolean {
        let hasFilters = false;
        if (this.filterData) {
            hasFilters ||= Boolean(this.filterData.filterAddresses);
            hasFilters ||= Boolean(this.filterData.excludedAddresses);
            hasFilters ||= Boolean(this.filterData.minBlock);
            hasFilters ||= Boolean(this.filterData.maxBlock);
            hasFilters ||= Boolean(this.filterData.minAmount);
            hasFilters ||= Boolean(this.filterData.maxAmount);
            hasFilters ||= Boolean(!this.filterData.includeReceive);
            hasFilters ||= Boolean(!this.filterData.includeChange);
            hasFilters ||= Boolean(!this.filterData.includeSend);
            hasFilters ||= this.filterData.showKnownAccounts;
        }
        return hasFilters;
    }
}
