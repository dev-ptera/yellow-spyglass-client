import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { KnownAccountDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';
import {UtilService} from "@app/services/util/util.service";

@Component({
    selector: 'app-known-accounts',
    templateUrl: './known-accounts.component.html',
    styleUrls: ['./known-accounts.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class KnownAccountsComponent implements OnInit {
    accountsDataSource;
    loading = true;
    error = false;
    displayedColumns = ['alias', 'type', 'owner'];
    @ViewChild('sort') sort: MatSort;

    constructor(
        private readonly _ref: ChangeDetectorRef,
        private readonly _api: ApiService,
        private readonly _searchService: SearchService,
        private readonly _router: Router,
        private readonly _util: UtilService,
        public vp: ViewportService
    ) {}

    ngOnInit(): void {
        this._api
            .getKnownAccounts()
            .then((data: KnownAccountDto[]) => {
                this.loading = false;
                this.accountsDataSource = new MatTableDataSource(data);
                this._ref.detectChanges();
                this.accountsDataSource.sort = this.sort;
            })
            .catch((err) => {
                console.error(err);
                this.error = true;
                this.loading = false;
            });
    }

    routeVanityAddresses(): void {
        void this._router.navigate([APP_NAV_ITEMS.vanity.route]);
    }

    formatAddr(addr: string): string {
        return this.vp.md ? this._util.shortenAddress(addr) : addr;
    }

    routeRepAddress(address: string): void {
        this._searchService.emitSearch(address);
    }
}
