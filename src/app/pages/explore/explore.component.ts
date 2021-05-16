import { Component, ViewEncapsulation } from '@angular/core';
import { blue, white } from '@pxblue/colors';
import { ViewportService } from '../../services/viewport/viewport.service';
import { ApiService } from '../../services/api/api.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AccountOverview, ConfirmedTransaction } from '../../types';
import { UtilService } from '../../services/util/util.service';

@Component({
    selector: 'app-explore',
    templateUrl: './explore.component.html',
    styleUrls: ['./explore.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ExploreComponent {
    pxbBlue = blue;
    pxbWhite = white;
    searchFormControl: FormControl;
    idFieldActive: boolean;
    touchedIdField: boolean;
    loading: boolean;
    monkeyTest;
    searchedValue: string;
    accountOverview: AccountOverview;
    confirmedTransactions: ConfirmedTransaction[];

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

    private destroyed$ = new Subject();

    constructor(
        private readonly _viewportService: ViewportService,
        private readonly _apiService: ApiService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _util: UtilService
    ) {
        this._router.events
            .pipe(
                filter((event: RouterEvent) => event instanceof NavigationStart),
                takeUntil(this.destroyed$)
            )
            .subscribe((event: NavigationStart) => {
                this.searchViaParams(event.url.split('?')[1]);
            });
    }

    ngOnInit(): void {
        this.searchFormControl = new FormControl();
        this.searchViaParams(window.location.search);
    }

    searchViaParams(params: string): void {
        const urlParams = new URLSearchParams(params);
        const address = urlParams.get('address');
        const hash = urlParams.get('transaction');
        const searchValue = this.searchFormControl.value;
        if (address && searchValue !== address) {
            this.search(address);
        } else if (hash && searchValue !== hash) {
            this.search(hash);
        }
    }

    search(searchValue: string): void {
        this.searchedValue = searchValue;
        this.loading = true;
        this.searchFormControl.setValue(searchValue);
        this.monkeyTest = undefined;
        this.confirmedTransactions = undefined;
        this.accountOverview = undefined;
        const spin = new Promise((resolve) => setTimeout(resolve, 500));

        // Confirmed Transactions
        Promise.all([
            this._apiService.confirmedTransactions(searchValue),
            this._apiService.accountOverview(searchValue),
            spin,
        ])
            .then(([confirmedTransactions, accountOverview]) => {
                this.loading = false;
                this.accountOverview = accountOverview;
                this.confirmedTransactions = confirmedTransactions;
                void this._router.navigate([], {
                    relativeTo: this._activatedRoute,
                    queryParams: { address: searchValue },
                });
            })
            .catch((err) => {
                console.error(err);
                this.loading = false;
            });

        // Monkey
        Promise.all([this._apiService.monkey(searchValue), spin])
            .then(([data]) => {
                this.monkeyTest = data;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    formatShortedAddress(addr: string): string {
        return `${addr.substr(0, 10)}...${addr.substr(addr.length - 6, addr.length)}`;
    }

    formatShortenedTx(tx: string): string {
        return `${tx.substr(0, 15)}...`;
    }
}
