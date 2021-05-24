import { Component, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '../../services/viewport/viewport.service';
import { ApiService } from '../../services/api/api.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UtilService } from '../../services/util/util.service';
import { AccountOverviewDto } from '@app/types/dto';
import { Block } from '@app/types/dto/Block';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ExploreComponent {
    searchFormControl: FormControl;
    idFieldActive: boolean;
    touchedIdField: boolean;
    loading: boolean;
    monkeySvg: string;
    searchedValue: string;
    accountOverview: AccountOverviewDto;
    blockResponse: Block;

    showAccount = false;
    showBlock = false;

    sampleAddresses = [
        'ban_39qbrcfii4imaekkon7gqs1emssg7pfhiirfg7u85nh9rnf51zbmr84xrtbp',
        'ban_1jmbtdgh1c1jjfyhgyr8pq8dzb48xghjsmgx5cuqmrqupymp6zyw514ub9ye',
        'ban_15qir7oegw5uaus1tb8dibn9cgeg941n44hhieofh55kgp93od73dfo7f67t',
    ];

    sampleTransactions = [
        'EA3A67403F255C47AE1698350D1BA2D8CD3C108A8688144B191ED6BBE60EF91D',
        '88E8265AE188AAC33173CFD46EDE051B92055928CDF91D060F303BEE2D047459',
        'CB397ED6BC2728B370295EF980BC0AF91FE4F4059C52EE71B15C9F1EF0240254',
    ];

    navigation$;

    constructor(
        public vp: ViewportService,
        private readonly _router: Router,
        private readonly _util: UtilService,
        private readonly _apiService: ApiService,
        private readonly _activatedRoute: ActivatedRoute
    ) {
        this.navigation$ = this._router.events
            .pipe(filter((event: RouterEvent) => event instanceof NavigationStart))
            .subscribe((event: NavigationStart) => {
                this.searchViaParams(event.url.split('?')[1]);
            });
    }

    ngOnInit(): void {
        console.log('on init');
        this.searchFormControl = new FormControl();
        this.searchViaParams(window.location.search);
    }

    ngOnDestroy(): void {
        this.navigation$.unsubscribe();
    }

    searchViaParams(params: string): void {
        const urlParams = new URLSearchParams(params);
        const address = urlParams.get('address');
        const hash = urlParams.get('hash');
        if (address && this.searchedValue !== address) {
            this.search(address);
        } else if (hash && this.searchedValue !== hash) {
            this.search(hash);
        }
        if (!address && !hash) {
            this.showBlock = false;
            this.showAccount = false;
            this.searchedValue = undefined;
        }
    }

    search(searchValue: string): void {
        this.loading = true;
        this.searchedValue = searchValue;
        this.searchFormControl.setValue(searchValue);
        this.showBlock = false;
        this.showAccount = false;
        this.monkeySvg = undefined;
        this.accountOverview = undefined;
        this.blockResponse = undefined;
        if (searchValue.startsWith('ban_')) {
            this._searchAccount(searchValue);
        } else {
            this._searchTransaction(searchValue);
        }
    }

    private _searchAccount(address): void {
        this.showAccount = true;
        const spin = new Promise((resolve) => setTimeout(resolve, 500));

        // Confirmed Transactions
        Promise.all([this._apiService.accountOverview(address), spin])
            .then(([accountOverview]) => {
                this.loading = false;
                this.accountOverview = accountOverview;
                void this._router.navigate([], {
                    relativeTo: this._activatedRoute,
                    queryParams: { address },
                });
            })
            .catch((err) => {
                console.error(err);
                this.loading = false;
            });

        // Monkey
        Promise.all([this._apiService.monkey(address), spin])
            .then(([data]) => {
                this.monkeySvg = data;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    private _searchTransaction(hash: string): void {
        this.showBlock = true;
        const spin = new Promise((resolve) => setTimeout(resolve, 500));

        // Confirmed Transactions
        Promise.all([this._apiService.block(hash), spin])
            .then(([blockResponse]) => {
                this.loading = false;
                this.blockResponse = blockResponse;
                void this._router.navigate([], {
                    relativeTo: this._activatedRoute,
                    queryParams: { hash },
                });
            })
            .catch((err) => {
                console.error(err);
                this.loading = false;
            });
    }

    formatShortedAddress(addr: string): string {
        return `${addr.substr(0, 10)}...${addr.substr(addr.length - 6, addr.length)}`;
    }

    formatShortenedTx(tx: string): string {
        return `${tx.substr(0, 15)}...`;
    }
}
