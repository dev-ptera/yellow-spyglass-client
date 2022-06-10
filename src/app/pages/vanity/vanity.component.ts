import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { MonkeyCacheService } from '@app/services/monkey-cache/monkey-cache.service';
import { AliasService } from '@app/services/alias/alias.service';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';

@Component({
    selector: 'app-vanity',
    templateUrl: 'vanity.component.html',
})
export class VanityComponent implements OnInit {
    hasError: boolean;
    isLoading: boolean;

    navItems = APP_NAV_ITEMS;

    vanityAddresses = [];

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
        public monkeyCache: MonkeyCacheService,
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        this._apiService
            .fetchKnownVanities()
            .then((vanityAddresses) => {
                this.vanityAddresses = vanityAddresses;
                this._fetchVanityMonkeys(vanityAddresses);
            })
            .catch((err) => {
                console.error(err);
                this.isLoading = false;
                this.hasError = true;
            });
    }

    private _fetchVanityMonkeys(vanityAddresses: string[]): void {
        const monkeyPromise: Array<Promise<void>> = [];
        for (const address of vanityAddresses) {
            if (this.monkeyCache.getMonkey(address)) {
                continue;
            }
            monkeyPromise.push(
                this._apiService
                    .fetchMonKey(address)
                    .then((monkey: string) => {
                        this.monkeyCache.addCache(address, monkey);
                        return Promise.resolve();
                    })
                    .catch((err) => {
                        console.error(err);
                        this.hasError = true;
                        this.isLoading = false;
                        return Promise.reject(err);
                    })
            );
        }
        void Promise.all(monkeyPromise).then(() => {
            this.isLoading = false;
            this._ref.detectChanges();
        });
    }
}
