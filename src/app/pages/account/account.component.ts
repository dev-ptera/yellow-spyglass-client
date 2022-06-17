import { ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
    AccountNFTDto,
    AccountOverviewDto,
    ConfirmedTransactionDto,
    DelegatorDto,
    ReceivableTransactionDto
} from '@app/types/dto';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { UtilService } from '@app/services/util/util.service';
import { ApiService } from '@app/services/api/api.service';
import { MonkeyCacheService } from '@app/services/monkey-cache/monkey-cache.service';
import { PriceService } from '@app/services/price/price.service';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { OnlineRepsService } from '@app/services/online-reps/online-reps.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AliasService } from '@app/services/alias/alias.service';
import { APP_NAV_ITEMS, hashNavItem } from '../../navigation/nav-items';

@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AccountComponent implements OnDestroy {
    address: string;
    confirmedBalance: string;
    accountRepresentative: string;

    insights: InsightsDto;
    accountOverview: AccountOverviewDto;

    isLoading: boolean;
    hasError: boolean;
    insightsDisabled: boolean;
    isLoadingInsights: boolean;
    hasInsightsError: boolean;
    isLoadingNFTs: boolean;

    weightSum: number;
    showTabNumber: number;
    confirmedTxPageIndex: number;
    delegatorCount: number;

    navItems = APP_NAV_ITEMS;

    MAX_INSIGHTS = 100_000;

    delegators: DelegatorDto[];
    nfts: AccountNFTDto[];
    receivableTransactions: ReceivableTransactionDto[] = [];
    readonly txPerPage = 50;

    confirmedTransactions: {
        all: Map<number, ConfirmedTransactionDto[]>;
        display: ConfirmedTransactionDto[];
    };

    paginatorSize = 50;
    routeListener: Subscription;

    constructor(
        public vp: ViewportService,
        public apiService: ApiService,
        public onlineRepService: OnlineRepsService,
        private readonly _router: Router,
        private readonly _util: UtilService,
        private readonly _priceService: PriceService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _monkeyCache: MonkeyCacheService,
        private readonly _aliasService: AliasService
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

    private _init(): void {
        this.address = undefined;
        this.insights = undefined;
        this.accountOverview = undefined;
        this.delegators = [];
        this.receivableTransactions = [];
        this.hasError = false;
        this.isLoading = true;
        this.insightsDisabled = true;
        this.hasInsightsError = false;
        this.isLoadingInsights = false;
        this.showTabNumber = 1;
        this.confirmedTxPageIndex = 0;
        this.delegatorCount = 0;
        this.confirmedTransactions = {
            all: new Map<number, ConfirmedTransactionDto[]>(),
            display: [],
        };
    }

    /** Call this method whenever someone has accidently routed to the hash page, but with an address. */
    private _redirectToHashPage(hash: string): void {
        void this._router.navigate([`/${hashNavItem.route}/${hash}`], { replaceUrl: true });
    }

    /** Given a ban address, searches for account. */
    private _searchAccount(address): void {
        if (!address) {
            return;
        }

        if (!address.startsWith('ban_')) {
            this._redirectToHashPage(address);
        }

        this._init();
        this.address = address;
        this._ref.detectChanges();

        Promise.all([
            this.apiService.fetchAccountOverview(address),
            this.apiService.fetchConfirmedTransactions(address, 0, this.paginatorSize),
            this.apiService.fetchReceivableTransactions(address),
        ])
            .then((data) => {
                // Only prepare new account if the loaded data matches the expected address for the page.
                if (data[0].address === this.address) {
                    this._prepareNewAccount(data);
                }
            })
            .catch((err) => {
                console.error(err);
                this.hasError = true;
            })
            .finally(() => {
                this.isLoading = false;
            });

        // Delegators
        void this.fetchDelegators();
    }

    /** Called when a user clicks the insights tab for the first time. */
    fetchInsights(): void {
        if (this.insights) {
            return;
        }
        if (this.isLoadingInsights) {
            return;
        }
        if (this.insightsDisabled) {
            return;
        }

        this.isLoadingInsights = true;
        this.apiService
            .fetchInsights(this.address)
            .then((data) => {
                this.insights = data;
                this._ref.detectChanges();
            })
            .catch((err) => {
                console.error(err);
                this.hasInsightsError = true;
                this._ref.detectChanges();
            })
            .finally(() => {
                this.isLoadingInsights = false;
            });
    }

    fetchDelegators(): void {
        this.apiService
            .fetchAccountDelegators(this.address, this.delegators.length)
            .then((data) => {
                this.delegators.push(...data.delegators);
                this.delegatorCount = data.fundedCount;
                if (!this.weightSum) {
                    this.weightSum = data.weightSum;
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * Called whenever a new address has been loaded.
     */
    private _prepareNewAccount(
        data: [AccountOverviewDto, ConfirmedTransactionDto[], ReceivableTransactionDto[]]
    ): void {
        this.accountOverview = data[0];
        this.confirmedTransactions.all.set(0, data[1]);
        this.confirmedTransactions.display = data[1];
        this.receivableTransactions = data[2];
        this.insightsDisabled = this.accountOverview.blockCount > this.MAX_INSIGHTS || !this.accountOverview.opened;

        if (this.accountOverview.weight) {
            this.weightSum = this.accountOverview.weight;
        }

        if (!this.delegatorCount) {
            this.delegatorCount = data[0].delegatorsCount;
        }

        if (!this.accountOverview.opened) {
            return;
        }

        const balance = this.accountOverview.balance;
        // Make sure 0 is included as well.
        if (!Number.isNaN(balance)) {
            this.confirmedBalance = this._util.numberWithCommas(parseFloat(balance.toFixed(4)));
        }

        const rep = this.accountOverview.representative;
        if (rep) {
            this.accountRepresentative = this._aliasService.has(rep)
                ? this._aliasService.get(rep)
                : `${rep.substr(0, 11)}...${rep.substr(rep.length - 6, rep.length)}`;
        }
    }

    /** When a user has more than 50 confirmed transactions, can be called to move to the next page of transactions. */
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
                this.confirmedTransactions.all.set(currPage, data);
                this.confirmedTransactions.display = data;
                this._ref.detectChanges();
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /** Returns true if an account is considered a representative.  Must be opened with at least 1 delegator. */
    isRepresentative(): boolean {
        return this.accountOverview && this.accountOverview.opened && this.accountOverview.weight > 0;
    }

    /** Converts a raw to a USD amount. */
    formatUsdPrice(raw: string): number {
        const ban = this._util.convertRawToBan(raw, { precision: 2, comma: false });
        const price = this._priceService.priceInUSD(Number(ban));
        if (price > 100000) {
            return Math.round(price);
        }
        return price;
    }

    /** Converts a raw amount to a bitcoin amount. */
    formatBtcPrice(raw: string): string {
        const ban = this._util.convertRawToBan(raw, { precision: 2, comma: false });
        return `₿${this._util.numberWithCommas(this._priceService.priceInBitcoin(Number(ban)).toFixed(4))}`;
    }

    formatAccountAddress(address: string): string {
        if (address) {
            const firstBits = address.substring(0, 12);
            const midBits = address.substring(12, 58);
            const lastBits = address.substring(58, 64);
            return `<strong class="">${firstBits}</strong><span class="secondary">${midBits}</span><strong class="">${lastBits}</strong>`;
        }
    }

    fetchNfts(): void {
        this.nfts = [];
        this.isLoadingNFTs = true;
        this.apiService.fetchAccountNFTs(this.address).then((data) => {
            this.nfts = data;
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            this.isLoadingNFTs = false
        })
    }

    hasAlias(address: string): boolean {
        return this._aliasService.has(address);
    }

    getAlias(address: string): string {
        return this._aliasService.get(address);
    }

    withCommas(x: number): string {
        return this._util.numberWithCommas(x);
    }
}
