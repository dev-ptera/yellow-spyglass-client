import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UtilService } from '@app/services/util/util.service';
import { AccountOverviewDto } from '@app/types/dto';
import { BlockDto } from '@app/types/dto/BlockDto';
import { ApiService } from '@app/services/api/api.service';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
    searchFormControl: FormControl;
    idFieldActive: boolean;
    touchedIdField: boolean;
    loading: boolean;
    error: boolean;
    monkeySvg: string;
    searchedValue: string;
    accountOverview: AccountOverviewDto;
    blockResponse: BlockDto;

    showAccount = false;
    showBlock = false;
    navigation$;

    constructor(
        public vp: ViewportService,
        private readonly _router: Router,
        private readonly _util: UtilService,
        private readonly _apiService: ApiService,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.searchFormControl = new FormControl();
    }

    ngOnDestroy(): void {
        if (this.navigation$) {
            this.navigation$.unsubscribe();
        }
    }

    search(searchValue: string): void {
        this.loading = true;
        this.error = false;
        this.searchedValue = searchValue;
        this.searchFormControl.setValue(searchValue);
        this.showBlock = false;
        this.showAccount = false;
        this.monkeySvg = undefined;
        this.accountOverview = undefined;
        this.blockResponse = undefined;
        window.scrollTo(0, 0);
        if (searchValue.toLowerCase().startsWith('ban_')) {
            this._searchAccount(searchValue.toLowerCase());
        } else {
            this._searchTransaction(searchValue.toUpperCase());
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
                this.error = true;
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
                this.error = true;
            });
    }
}
