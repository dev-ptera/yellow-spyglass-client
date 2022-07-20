import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import { Transaction, TransactionsService } from '@app/pages/account/tabs/transactions/transactions.service';
import { ConfirmedTransactionDto } from '@app/types/dto';

@Component({
    selector: 'account-tx-tab',
    templateUrl: 'transactions-tab.component.html',
    styleUrls: ['transactions-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TransactionsTabComponent implements OnInit {
    @Input() address: string;
    @Input() isPending: boolean;
    @Input() blockCount: number;

    displayedTransactions: Transaction[] = [];
    navItems = APP_NAV_ITEMS;
    dateMap: Map<string, { date: string; diffDays: number; relativeTime: string }> = new Map();
    confirmedTxPageIndex = 0;
    readonly txPerPage = 50;
    isLoading: boolean;

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService
    ) {}

    ngOnInit(): void {
        this.changePage(0);
    }

    /** When a user has more than 50 confirmed transactions, can be called to move to the next page of transactions. */
    changePage(pageNumber: number): void {
        this.confirmedTxPageIndex = pageNumber;
        this.txService
            .loadTransactionsPage(this.address, this.confirmedTxPageIndex, this.txPerPage, this.blockCount, undefined)
            .then((data: ConfirmedTransactionDto[]) => {
                this.displayedTransactions = data;
                this.txService.createDateMap(this.displayedTransactions, this.dateMap);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    trackByFn(index: number): number {
        return index;
    }
}
