import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import * as QRCode from 'qrcode';
import { AccountOverviewDto, ConfirmedTransactionDto, PendingTransactionDto } from '@app/types/dto';
import { Delegator } from '@app/types/modal/Delegator';
import { ConfirmedTransaction } from '@app/types/modal/ConfirmedTransaction';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { ApiService } from '@app/services/api/api.service';
import { MonkeyCacheService } from '@app/services/monkey-cache/monkey-cache.service';
import { PendingTransaction } from '@app/types/modal';
import { SearchService } from '@app/services/search/search.service';
import { PriceService } from '@app/services/price/price.service';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AccountComponent implements OnChanges {
    @Input() accountOverview: AccountOverviewDto;
    @Input() loading: boolean;
    @Input() address: string;
    @Input() monkeySvg: string;

    pendingBalance: string;
    confirmedBalance: string;
    shortenedRep: string;
    insights: InsightsDto;
    insightsDisabled: boolean;
    loadingInsights: boolean;
    hasInsightsError: boolean;

    delegators: Delegator[] = [];
    weightSum = 0;
    readonly txPerPage = 50;

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
        private readonly _priceService: PriceService,
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
        this.insights = undefined;
        this.loadingInsights = false;
        this.insightsDisabled = this.accountOverview.completedTxCount > 50_000;
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
            this.weightSum += Number(this._util.convertRawToBan(delegator.weightRaw, { precision: 6, comma: false }));
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
        this._fetchMonkeys(this.confirmedTransactions.display);
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
        this._fetchMonkeys(this.pendingTransactions.display);
    }

    private _fetchMonkeys(transactions: ConfirmedTransaction[] | PendingTransaction[]): void {
        const addrSet = new Set<string>();
        for (const tx of transactions) {
            addrSet.add(tx.address);
        }
        const monkeyPromise: Array<Promise<void>> = [];
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
        QRCode.toCanvas(canvas, addr, (error) => {
            if (error) console.error(error);
        });
    }

    private _formatDateString(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return `${date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}/${
            date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
        }/${this.vp.sm ? date.getFullYear().toString().substring(2, 4) : `${date.getFullYear()}`}`;
    }

    private _formatTimeString(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return date.toTimeString().substr(0, 8);
    }

    private _setDisplayTx(tx: { display: any[]; all: any[] }, pageIndex: number): void {
        const pageSize = this.paginatorSize;
        tx.display = tx.all.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
    }

    changePage(currPage: number): void {
        this.confirmedTxPageIndex = currPage;
        if (this.loadedConfirmedTxPages.has(currPage)) {
            this._setDisplayTx(this.confirmedTransactions, currPage);
            return;
        }
        this._apiService
            .confirmedTransactions(this.address, currPage * this.txPerPage, this.txPerPage)
            .then((data: ConfirmedTransactionDto[]) => {
                this.loadedConfirmedTxPages.add(currPage);
                for (const tx of data) {
                    this.confirmedTransactions.all.push(this._convertConfirmedTxDtoToModal(tx));
                }
                this.confirmedTransactions.all.sort((a, b) => (a.height < b.height ? 1 : -1));
                // Debounce monkey fetch api?
                this._setDisplayTx(this.confirmedTransactions, currPage);
                this._fetchMonkeys(this.confirmedTransactions.display);
                this._ref.detectChanges();
            })
            .catch((err) => {
                console.error(err);
            });
    }

    getConfirmedBadge(): string {
        return this._util.numberWithCommas(this.accountOverview.completedTxCount);
    }

    getPendingBadge(): string {
        return this._util.numberWithCommas(this.accountOverview.pendingTxCount);
    }

    getDelegatorsBadge(): string {
        return this._util.numberWithCommas(this.accountOverview.delegatorsCount);
    }

    formatUsdPrice(raw: string): number {
        const ban = this._util.convertRawToBan(raw, { precision: 2, comma: false });
        const price = this._priceService.priceInUSD(Number(ban));
        if (price > 100000) {
            return Math.round(price);
        }
        return price;
    }

    formatBtcPrice(raw: string): string {
        const ban = this._util.convertRawToBan(raw, { precision: 2, comma: false });
        return `₿${this._util.numberWithCommas(this._priceService.priceInBitcoin(Number(ban)).toFixed(4))}`;
    }

    fetchInsights(event: MatTabChangeEvent): void {
        if (!this.insights && !this.loadingInsights && !this.insightsDisabled && event.index === 3) {
            this.loadingInsights = true;
            this._apiService
                .getInsights(this.address)
                .then((data) => {
                    this.insights = data;
                    this.loadingInsights = false;
                })
                .catch((err) => {
                    console.error(err);
                    this.loadingInsights = false;
                    this.hasInsightsError = true;
                });
        }
    }
}
