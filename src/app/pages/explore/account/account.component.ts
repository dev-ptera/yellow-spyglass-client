import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import * as QRCode from 'qrcode';
import { PageEvent } from '@angular/material/paginator';
import { AccountOverviewDto, ConfirmedTransactionDto, PendingTransactionDto } from '@app/types/dto';
import { Delegator } from '@app/types/modal/Delegator';
import { ConfirmedTransaction } from '@app/types/modal/ConfirmedTransaction';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { ApiService } from '@app/services/api/api.service';
import { MonkeyCacheService } from '@app/services/monkey-cache/monkey-cache.service';
import { PendingTransaction } from '@app/types/modal';
import { SearchService } from '@app/services/search/search.service';

@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AccountComponent {
    @Input() accountOverview: AccountOverviewDto;
    @Input() loading: boolean;
    @Input() address: string;
    @Input() monkeySvg: string;

    pendingBalance: string;
    confirmedBalance: string;
    shortenedRep: string;

    delegators: Delegator[] = [];

    confirmedTransactions: {
        all: ConfirmedTransaction[];
        display: ConfirmedTransaction[];
    };

    pendingTransactions: {
        all: PendingTransaction[];
        display: PendingTransaction[];
    };

    paginatorSize = 50;
    confirmedTxPageIndex = 0;
    pendingTxPageIndex = 0;
    loadedConfirmedTxPages: Set<number>;
    loadedPendingTxPages: Set<number>;

    constructor(
        public vp: ViewportService,
        public searchService: SearchService,
        private readonly _util: UtilService,
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _monkeyCache: MonkeyCacheService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.address && changes.address.currentValue) {
            this._renderQRCode(this.address);
        }
        if (changes.accountOverview && changes.accountOverview.currentValue) {
            this._prepareNewAccount();
        }
    }

    /**
     * Called whenever a new address has been loaded.
     * Converts DTO into displayable format.
     */
    private _prepareNewAccount(): void {
        this.confirmedTxPageIndex = 0;
        this.pendingTxPageIndex = 0;
        this.loadedConfirmedTxPages = new Set<number>().add(0);
        this.loadedPendingTxPages = new Set<number>().add(0);
        this._prepareAccountOverview(this.accountOverview);
        this._prepareConfirmed(this.accountOverview);
        this._preparePending(this.accountOverview);
        this._prepareDelegators(this.accountOverview);
    }

    /**
     * Formats account balance, account pending, and representative.
     */
    private _prepareAccountOverview(accountOverview: AccountOverviewDto): void {
        const approxBalance = accountOverview.balanceRaw !== '0';
        const approxPending = accountOverview.pendingRaw !== '0';
        this.confirmedBalance = this._util.convertRawToBan(accountOverview.balanceRaw, { precision: 2, comma: true });
        if (approxBalance && this.confirmedBalance === '0') {
            this.confirmedBalance = '~0';
        }
        this.pendingBalance = this._util.convertRawToBan(accountOverview.pendingRaw, { precision: 2, comma: true });
        if (approxPending && this.pendingBalance === '0') {
            this.pendingBalance = '~0';
        }
        const rep = accountOverview.representative;
        this.shortenedRep = `${rep.substr(0, 11)}...${rep.substr(rep.length - 6, rep.length)}`;
    }

    /**
     * Sorts delegators based on weight descending and formats RAW balance into BAN balance.
     */
    private _prepareDelegators(accountOverview: AccountOverviewDto): void {
        this.delegators = [];
        for (const delegator of accountOverview.delegators) {
            this.delegators.push({
                address: delegator.address,
                weight: this._util.convertRawToBan(delegator.weightRaw, {
                    precision: 3,
                }),
            });
        }
        this.delegators.sort((a, b) => (Number(a.weight) < Number(b.weight) ? 1 : -1));
        for (const delegator of this.delegators) {
            delegator.weight = this._util.numberWithCommas(delegator.weight);
            if (delegator.weight === '0') {
                delegator.weight = '~0';
            }
        }
    }

    private _prepareConfirmed(accountOverview: AccountOverviewDto): void {
        this.confirmedTransactions = {
            all: [],
            display: [],
        };
        for (const confirmedTx of accountOverview.confirmedTransactions) {
            this.confirmedTransactions.all.push(this._convertConfirmedTxDtoToModal(confirmedTx));
        }
        this.confirmedTransactions.display = this.confirmedTransactions.all;
        this.fetchMonkeys(this.confirmedTransactions.display);
    }

    private _preparePending(accountOverview: AccountOverviewDto): void {
        this.pendingTransactions = {
            all: [],
            display: [],
        };
        for (const pendingTx of accountOverview.pendingTransactions) {
            this.pendingTransactions.all.push(this._convertPendingTxDtoToModal(pendingTx));
        }
        this.pendingTransactions.display = this.pendingTransactions.all;
        this.fetchMonkeys(this.pendingTransactions.display);
    }

    private fetchMonkeys(transactions: ConfirmedTransaction[] | PendingTransaction[]): void {
        const addrSet = new Set<string>();
        for (const tx of transactions) {
            addrSet.add(tx.address);
        }
        const monkeyPromise: Promise<void>[] = [];
        for (const addr of addrSet.values()) {
            if (this._monkeyCache.getMonkey(addr)) {
                continue;
            }
            monkeyPromise.push(
                this._apiService
                    .monkey(addr)
                    .then((monkey: string) => {
                        this._monkeyCache.addCache(addr, monkey);
                        return Promise.resolve();
                    })
                    .catch((err) => {
                        console.error(err);
                        return Promise.reject(err);
                    })
            );
        }
        void Promise.all(monkeyPromise).then(() => {
            this._ref.detectChanges();
        });
    }

    /**
     * Converts a ConfirmedTransactionDto into a displayable format.
     */
    private _convertConfirmedTxDtoToModal(tx: ConfirmedTransactionDto): ConfirmedTransaction {
        return {
            balance: `${this._util.convertRawToBan(tx.balanceRaw, { precision: 5, comma: true, state: tx.type })} BAN`,
            hash: tx.hash,
            type: tx.type,
            height: tx.height,
            formatHeight: `#${this._util.numberWithCommas(tx.height)}`,
            address: tx.address || tx.newRepresentative,
            date: this._formatDateString(tx.timestamp),
            time: this._formatTimeString(tx.timestamp),
        };
    }

    /**
     * Converts a ConfirmedTransactionDto into a displayable format.
     */
    private _convertPendingTxDtoToModal(tx: PendingTransactionDto): PendingTransaction {
        return {
            balance: `${this._util.convertRawToBan(tx.balanceRaw, {
                precision: 5,
                comma: true,
                state: 'receive',
            })} BAN`,
            hash: tx.hash,
            address: tx.address,
            date: this._formatDateString(tx.timestamp),
            time: this._formatTimeString(tx.timestamp),
        };
    }

    private _renderQRCode(addr: string): void {
        this._ref.detectChanges();
        const canvas = document.getElementById('qr-code');
        QRCode.toCanvas(canvas, addr, function (error) {
            if (error) console.error(error);
        });
    }

    private _formatDateString(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return (
            (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
            '/' +
            (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
            '/' +
            (this.vp.sm ? date.getFullYear().toString().substring(2, 4) : date.getFullYear() + '')
        );
    }

    private _formatTimeString(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return date.toTimeString().substr(0, 8);
    }

    private _setDisplayTx(tx: { display: any[]; all: any[] }, pageIndex: number): void {
        const pageSize = this.paginatorSize;
        tx.display = tx.all.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
    }

    changePage(e: PageEvent): void {
        this.confirmedTxPageIndex = e.pageIndex;
        if (this.loadedConfirmedTxPages.has(e.pageIndex)) {
            this._setDisplayTx(this.confirmedTransactions, e.pageIndex);
            return;
        }
        this._apiService
            .confirmedTransactions(this.address, e.pageSize * e.pageIndex)
            .then((data: ConfirmedTransactionDto[]) => {
                this.loadedConfirmedTxPages.add(e.pageIndex);
                for (const tx of data) {
                    this.confirmedTransactions.all.push(this._convertConfirmedTxDtoToModal(tx));
                }
                this.confirmedTransactions.all.sort((a, b) => (a.height < b.height ? 1 : -1));
                // Debounce monkey fetch api?
                this._setDisplayTx(this.confirmedTransactions, e.pageIndex);
                this.fetchMonkeys(this.confirmedTransactions.display);
                this._ref.detectChanges();
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
