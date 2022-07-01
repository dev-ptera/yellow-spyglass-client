import { Injectable } from '@angular/core';
import { FilterDialogData } from '@app/pages/account/tabs/brpd/brpd-tab.component';
import { ApiService } from '@app/services/api/api.service';
import { Transaction } from '@app/pages/account/tabs/transactions/transactions-tab.component';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    isLoadingTransactions: boolean;
    maxPageLoaded: number;

    confirmedTransactions: {
        all: Map<number, Transaction[]>;
    };

    constructor(private readonly _apiService: ApiService) {
        this.forgetTransactions();
    }

    forgetTransactions(): void {
        this.maxPageLoaded = 0;
        this.confirmedTransactions = {
            all: new Map<number, Transaction[]>(),
        };
    }

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
        } catch (err) {}

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
