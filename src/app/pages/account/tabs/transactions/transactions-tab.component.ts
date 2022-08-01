import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';
import {Transaction, TransactionsService} from "@app/services/transactions/transactions.service";

@Component({
    selector: 'account-tx-tab',
    templateUrl: 'transactions-tab.component.html',
    styleUrls: ['transactions-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TransactionsTabComponent {
    @Input() address: string;
    @Input() isPending: boolean;
    @Input() blockCount: number;
    @Input() txPerPage: number;

    navItems = APP_NAV_ITEMS;
    isLoading: boolean;

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService
    ) {}

    getDisplayedTransactions(): Transaction[] {
        if (this.isPending) {
            return this.txService.receivableTransactions;
        }
        return this.txService.confirmedTransactions.display;
    }

    trackByFn(index: number): number {
        return index;
    }
}
