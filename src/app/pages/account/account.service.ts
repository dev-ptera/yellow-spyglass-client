import { Injectable } from '@angular/core';
import { FilterDialogData } from '@app/pages/account/tabs/brpd/brpd-tab.component';
import { ApiService } from '@app/services/api/api.service';
import { Transaction } from '@app/pages/account/tabs/transactions/transactions-tab.component';
import { InsightsDto } from '@app/types/dto';
import { DelegatorsTabService } from '@app/pages/account/tabs/delegators/delegators-tab.service';
import { InsightsTabService } from '@app/pages/account/tabs/insights/insights-tab.service';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    isLoadingTransactions: boolean;
    maxPageLoaded: number;
    loadedAddress: string;

    confirmedTransactions: {
        all: Map<number, Transaction[]>;
    };

    constructor(
        private readonly _apiService: ApiService,
        private readonly _delegatorsTabService: DelegatorsTabService,
        private readonly _insightsTabService: InsightsTabService
    ) {
        this.forgetTransactions();
    }

    /** Call this function to forget all the previous loaded transactions for an account.  Clears all pagination history. */
    forgetTransactions(): void {
        this._delegatorsTabService.forgetAccount();
        this._insightsTabService.forgetAccount();
        this.maxPageLoaded = 0;
        this.confirmedTransactions = {
            all: new Map<number, Transaction[]>(),
        };
    }

    setLoadedAddress(newAddress: string): void {
        this.forgetTransactions();
        this.loadedAddress = newAddress;
    }

    /** Checks if we have historically loaded the page; if so display it.  It otherwise fetches the page remotely. */
    async loadTransactionsPage(
        address: string,
        page: number,
        pageSize: number,
        blockCount: number,
        filterData: FilterDialogData
    ): Promise<Transaction[]> {
        if (this.confirmedTransactions.all.has(page)) {
            return this.confirmedTransactions.all.get(page);
        }

        if (this.isLoadingTransactions) {
            return;
        }

        this.isLoadingTransactions = true;

        let offset = 0;
        try {
            const displayed = this.confirmedTransactions.all.get(this.maxPageLoaded);
            offset = blockCount - displayed[displayed.length - 1].height + 1;
        } catch (err) {
            //   console.error(err);
        }

        try {
            const data = (await this._apiService.fetchFilteredTransaction(
                address,
                pageSize,
                offset,
                filterData
            )) as Transaction[];
            this.confirmedTransactions.all.set(page, data);
            this.isLoadingTransactions = false;

            if (page > this.maxPageLoaded) {
                this.maxPageLoaded = page;
            }
            return data;
        } catch (err) {
            this.isLoadingTransactions = false;
            console.error(err);
        }
    }
}
