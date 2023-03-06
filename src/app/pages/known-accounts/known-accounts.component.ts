import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { KnownAccountDto } from '@app/types/dto';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';
import { UtilService } from '@app/services/util/util.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatChip, MatChipList } from '@angular/material/chips';

@Component({
    selector: 'app-known-accounts',
    templateUrl: './known-accounts.component.html',
    styleUrls: ['./known-accounts.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    encapsulation: ViewEncapsulation.None,
})
export class KnownAccountsComponent implements OnInit {
    unfilteredKnownAccounts = [];
    accountsDataSource;
    navItems = APP_NAV_ITEMS;
    isLoading = true;
    hasError = false;
    types: Set<string> = new Set();
    displayedColumns = ['alias', 'type', 'owner', 'expand'];
    mobileDisplayedColumns = ['alias', 'expand'];
    expandedElement: KnownAccountDto | null;

    @ViewChild('sort') sort: MatSort;
    @ViewChild('chipList') chipList: MatChipList;

    constructor(
        private readonly _ref: ChangeDetectorRef,
        private readonly _api: ApiService,
        private readonly _router: Router,
        private readonly _util: UtilService,
        public vp: ViewportService
    ) {}

    ngOnInit(): void {
        this._api
            .fetchKnownAccounts()
            .then((data: KnownAccountDto[]) => {
                this.isLoading = false;
                this.unfilteredKnownAccounts = data;
                this.accountsDataSource = new MatTableDataSource(data);
                this._ref.detectChanges();
                this.accountsDataSource.sort = this.sort;
            })
            .catch((err) => {
                console.error(err);
                this.hasError = true;
                this.isLoading = false;
            });
    }

    routeVanityAddresses(): void {
        void this._router.navigate([APP_NAV_ITEMS.vanity.route]);
    }

    formatAddr(addr: string): string {
        return this.vp.md || this.vp.sm ? this._util.shortenAddress(addr) : addr;
    }

    openRow(account: KnownAccountDto): void {
        if (!account.lore) {
            return;
        }

        if (this.expandedElement === account) {
            this.expandedElement = undefined;
        } else {
            this.expandedElement = account;
        }
    }

    selectChip(chip: MatChip): void {
        chip.toggleSelected();
        this.types = new Set<string>();
        if (chip.value !== 'all') {
            console.log(chip.value);
            this.accountsDataSource = new MatTableDataSource(
                this.unfilteredKnownAccounts.filter((account) => account.type === chip.value)
            );
        } else {
            this.accountsDataSource = new MatTableDataSource(this.unfilteredKnownAccounts);
        }
        this.accountsDataSource.sort = this.sort;
    }

    getDisplayColumns(): string[] {
        return this.vp.sm ? this.mobileDisplayedColumns : this.displayedColumns;
    }
}
