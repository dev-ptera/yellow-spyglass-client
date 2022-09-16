import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
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
        public apiService: ApiService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.isLoading = true;
        this.apiService
            .fetchKnownVanities()
            .then((vanityAddresses) => {
                this.vanityAddresses = vanityAddresses;
                this.isLoading = false;
            })
            .catch((err) => {
                console.error(err);
                this.isLoading = false;
                this.hasError = true;
            });
    }
}
