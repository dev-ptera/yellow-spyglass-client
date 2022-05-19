import {ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {AccountOverviewDto, ConfirmedTransactionDto, ReceivableTransactionDto} from '@app/types/dto';
import {Delegator} from '@app/types/modal/Delegator';
import {ConfirmedTransaction} from '@app/types/modal/ConfirmedTransaction';
import {ViewportService} from '@app/services/viewport/viewport.service';
import {UtilService} from '@app/services/util/util.service';
import {ApiService} from '@app/services/api/api.service';
import {MonkeyCacheService} from '@app/services/monkey-cache/monkey-cache.service';
import {PendingTransaction} from '@app/types/modal';
import {SearchService} from '@app/services/search/search.service';
import {PriceService} from '@app/services/price/price.service';
import {InsightsDto} from '@app/types/dto/InsightsDto';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {OnlineRepsService} from '@app/services/online-reps/online-reps.service';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AliasService} from '@app/services/alias/alias.service';

@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AccountComponent implements OnDestroy {
    isLoading: boolean;
    hasError: boolean;
    address: string;
    monkeySvg: string;

    pendingBalance: string;
    confirmedBalance: string;
    accountRepresentative: string;
    insights: InsightsDto;
    accountOverview: AccountOverviewDto;
    insightsDisabled: boolean;
    loadingInsights: boolean;
    hasInsightsError: boolean;

    delegators: Delegator[] = [];
    pendingTransactions: ReceivableTransactionDto[] = [];
    weightSum = 0;
    readonly txPerPage = 50;

    confirmedTransactions: {
        all: Map<number, ConfirmedTransactionDto[]>;
        display: ConfirmedTransactionDto[];
    };

    paginatorSize = 50;
    confirmedTxPageIndex = 0;
    routeListener: Subscription;

    showTabNumber = 1;

    constructor(
        public vp: ViewportService,
        public searchService: SearchService,
        public onlineRepService: OnlineRepsService,
        private readonly _router: Router,
        private readonly _util: UtilService,
        private readonly apiService: ApiService,
        private readonly _priceService: PriceService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _monkeyCache: MonkeyCacheService,
        private readonly _aliasService: AliasService,
    ) {
        this.routeListener = this._router.events.subscribe((route) => {
            if (route instanceof NavigationEnd) {
                const splitUrl = this._router.url.replace('/history', '').split('/');
                this._searchAccount(splitUrl[splitUrl.length - 1]);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.routeListener) {
            this.routeListener.unsubscribe();
        }
    }

    /** Given a ban address, searches for account. */
    private _searchAccount(address): void {
        this.address = address;
        this.monkeySvg = '';
        this.isLoading = true;
        this.hasError = false;
        this._ref.detectChanges();

        Promise.all([
            this.apiService.fetchAccountOverview(address),
            this.apiService.fetchConfirmedTransactions(address, 0, this.paginatorSize),
            this.apiService.fetchReceivableTransactions(address)
        ]).then((data) => {
            this._prepareNewAccount(data);
        })
            .catch((err) => {
                console.error(err);
                this.hasError = true;
            }).finally(() => {
                this.isLoading = false;
        })

        // MonKey
        this.apiService
            .fetchMonKey(address)
            .then((data) => {
                this.monkeySvg = data;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * Called whenever a new address has been loaded.
     */
    private _prepareNewAccount(data: [AccountOverviewDto, ConfirmedTransactionDto[], ReceivableTransactionDto[]]): void {
        this.accountOverview = data[0];
        this.pendingTransactions = data[2];
        this.confirmedTxPageIndex = 0;
        this.insights = undefined;
        this.loadingInsights = false;
        this.insightsDisabled = this.accountOverview.blockCount > 100_000 || !this.accountOverview.opened;
        this._prepareAccountOverview(this.accountOverview);
        this._prepareConfirmed(data[1]);
        this._prepareDelegators(this.accountOverview);
    }

    /**
     * Formats account balance, account pending, and representative.
     */
    private _prepareAccountOverview(accountOverview: AccountOverviewDto): void {
        const approxBalance = accountOverview.balanceRaw !== '0';
        const approxPending = accountOverview.receivableRaw !== '0';
        this.confirmedBalance = this._util.convertRawToBan(accountOverview.balanceRaw, { precision: 2, comma: true });
        if (approxBalance && this.confirmedBalance === '0') {
            this.confirmedBalance = '~0';
        }
        this.pendingBalance = this._util.convertRawToBan(accountOverview.receivableRaw, { precision: 2, comma: true });
        if (approxPending && this.pendingBalance === '0') {
            this.pendingBalance = '~0';
        }
        const rep = accountOverview.representative;
        this.accountRepresentative = this._aliasService.has(rep)
            ? this._aliasService.get(rep)
            : `${rep.substr(0, 11)}...${rep.substr(rep.length - 6, rep.length)}`;
    }

    /**
     * Sorts delegators based on weight descending and formats RAW balance into BAN balance.
     */
    private _prepareDelegators(accountOverview: AccountOverviewDto): void {
        this.delegators = [];
        this.weightSum = accountOverview.weight;
        /* for (const delegator of accountOverview.de) {
            this.delegators.push({
                address: delegator.address,
                weight:
                    !delegator.weightBan || delegator.weightBan < 0.01
                        ? '~0'
                        : this._util.numberWithCommas(
                              delegator.weightBan.toFixed(delegator.weightBan > 100000 ? 0 : 2)
                          ),
            });
        } */
    }

    private _prepareConfirmed(confirmedTransactions: ConfirmedTransactionDto[]): void {
        this.confirmedTransactions = {
            all: new Map<number, ConfirmedTransactionDto[]>(),
            display: [],
        };
        this.confirmedTransactions.all.set(0, confirmedTransactions);
        this.confirmedTransactions.display = confirmedTransactions;
    }

    /**
     * Converts a ConfirmedTransactionDto into a displayable format.
     */
    private _convertConfirmedTxDtoToModal(tx: ConfirmedTransactionDto): ConfirmedTransaction {
        return {
            balance: `${tx.amount} BAN`,
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
     * Converts a ReceivableTransactionDto into a displayable format.
     */
    private _convertPendingTxDtoToModal(tx: ReceivableTransactionDto): PendingTransaction {
        return {
            balance: `${tx.amount} BAN`,
            hash: tx.hash,
            address: tx.address,
            date: this._formatDateString(tx.timestamp),
            time: this._formatTimeString(tx.timestamp),
        };
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

    changePage(currPage: number): void {
        this.confirmedTxPageIndex = currPage;
        const preloadedPage = this.confirmedTransactions.all.get(currPage);
        if (preloadedPage) {
            this.confirmedTransactions.display = preloadedPage;
            return;
        }
        this.apiService
            .fetchConfirmedTransactions(this.address, currPage * this.txPerPage, this.txPerPage)
            .then((data: ConfirmedTransactionDto[]) => {
                const converted = [];
                for (const tx of data) {
                    converted.push(this._convertConfirmedTxDtoToModal(tx));
                }
                this.confirmedTransactions.all.set(currPage, converted);
                this.confirmedTransactions.display = converted;
                this._ref.detectChanges();
            })
            .catch((err) => {
                console.error(err);
            });
    }

    isRepresentative(): boolean {
        return this.accountOverview && this.accountOverview.opened && this.accountOverview.weight > 0;
    }

    getConfirmedBadge(): string {
        return this._util.numberWithCommas(this.accountOverview.blockCount);
    }

    getPendingBadge(): string {
        return this._util.numberWithCommas(this.accountOverview.receivable);
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
            this.apiService
                .getInsights(this.address)
                .then((data) => {
                    this.insights = data;
                    this.loadingInsights = false;
                    this._ref.detectChanges();
                })
                .catch((err) => {
                    console.error(err);
                    this.loadingInsights = false;
                    this.hasInsightsError = true;
                    this._ref.detectChanges();
                });
        }
    }

    formatAccountAddress(address: string): string {
        if (address) {
            const firstBits = address.substring(0, 12);
            const midBits = address.substring(12, 58);
            const lastBits = address.substring(58, 64);
            return `<strong class="">${firstBits}</strong><span class="secondary">${midBits}</span><strong class="">${lastBits}</strong>`;
        }
    }

    hasAlias(address: string): boolean {
        return this._aliasService.has(address);
    }

    getAlias(address: string): string {
        return this._aliasService.get(address);
    }
}
