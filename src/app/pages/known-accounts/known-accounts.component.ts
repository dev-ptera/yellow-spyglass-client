import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { KnownAccountDto } from '@app/types/dto';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';
import { UtilService } from '@app/services/util/util.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatChip, MatChipList } from '@angular/material/chips';
import { AccountActionsService } from '@app/services/account-actions/account-actions.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private fragment: string;

    @ViewChild('sort') sort: MatSort;
    @ViewChild('chipList') chipList: MatChipList;

    constructor(
        private readonly _ref: ChangeDetectorRef,
        private readonly _api: ApiService,
        private readonly _router: Router,
        private readonly _util: UtilService,
        private readonly _snackbar: MatSnackBar,
        private readonly _accountActionsService: AccountActionsService,
        public vp: ViewportService,
        private readonly route: ActivatedRoute
    ) {
        this.route.fragment.subscribe((fragment) => {
            this.fragment = fragment;
            this.navigateToFragment(this.fragment);
        });
    }

    navigateToFragment(fragment: string): void {
        setTimeout(() => {
            document.querySelector('#' + fragment)?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    ngOnInit(): void {
        this._api
            .fetchKnownAccounts()
            .then((data: KnownAccountDto[]) => {
                this.isLoading = false;
                this.unfilteredKnownAccounts = data;
                this.accountsDataSource = new MatTableDataSource(data);
                this._ref.detectChanges();
                this.navigateToFragment(this.fragment);
                data.forEach((entry) => {
                    if (entry.address === this.fragment && this.canOpenRow(entry)) {
                        this.expandedElement = entry;
                    }
                });
                this._setSort();
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

    canOpenRow(account: KnownAccountDto): boolean {
        return this.vp.sm || Boolean(account.lore);
    }

    openRow(account: KnownAccountDto): void {
        if (!this.canOpenRow(account)) {
            return;
        }

        if (this.expandedElement === account) {
            this.expandedElement = undefined;
        } else {
            this.expandedElement = account;
        }
    }

    copyLink(address: string): void {
        const el = document.createElement('textarea');
        el.value = `${window.location.href.split('#')[0]}#${address}`;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this._snackbar.open('Copied Link', undefined, {
            duration: 1000,
        });
        void this._router.navigate([`/${APP_NAV_ITEMS.knownAccounts.route}`], { fragment: address });
    }

    selectChip(chip: MatChip): void {
        chip.toggleSelected();
        this.types = new Set<string>();
        if (chip.value !== 'all') {
            this.accountsDataSource = new MatTableDataSource(
                this.unfilteredKnownAccounts.filter((account) => account.type === chip.value)
            );
        } else {
            this.accountsDataSource = new MatTableDataSource(this.unfilteredKnownAccounts);
        }
        this._setSort();
    }

    private _setSort(): void {
        this.accountsDataSource.sort = this.sort;
        this.accountsDataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
            if (typeof data[sortHeaderId] === 'string') {
                return data[sortHeaderId].toLocaleLowerCase();
            }

            return data[sortHeaderId];
        };
    }

    getDisplayColumns(): string[] {
        return this.vp.sm ? this.mobileDisplayedColumns : this.displayedColumns;
    }
}
