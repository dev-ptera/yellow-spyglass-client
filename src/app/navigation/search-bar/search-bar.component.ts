import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { Router } from '@angular/router';
import { APP_NAV_ITEMS } from '../nav-items';
import { ApiService } from '@app/services/api/api.service';
import { AliasDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { MatMenuTrigger } from '@angular/material/menu';

export let APP_SEARCH_BAR_ID = 0;

@Component({
    selector: 'app-search-bar',
    template: `
        <input
            [id]="inputId"
            [class.red]="trigger.menuOpen"
            class="app-search-bar-input divider-border"
            type="text"
            tabindex="0"
            autocapitalize="none"
            placeholder="Search by Address, Block, or Alias"
            [(ngModel)]="appbarSearchText"
            (click)="preventEmptyMenu()"
            (keyup)="filterOrSearch($event)"
            #trigger="matMenuTrigger"
            [matMenuTriggerFor]="menu"
        />

        <mat-menu #menu="matMenu" class="alias-search-menu">
            <button mat-menu-item *ngFor="let item of matchingAccounts"
                    (click)="emitSearch(item.address)"
                    [innerHTML]="item.alias | boldSearch: inputElement.value">
            </button>
        </mat-menu>
    `,
    styleUrls: ['./search-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent {
    @ViewChild('mobileSearchBar') searchBar: ElementRef;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    @Input() toolbarTitle: string;

    /** This input is used to turn off the auto-focus logic, only used when the input is being actively used. */
    @Input() onlyFocusWhenActivelySearching: boolean;
    @Output() closeSearch: EventEmitter<void> = new EventEmitter<void>();

    knownAccounts: AliasDto[] = [];
    matchingAccounts: AliasDto[] = [];

    appbarSearchText: string;
    pages = APP_NAV_ITEMS;

    inputId: string;
    inputElement: HTMLInputElement;

    constructor(
        public router: Router,
        public vp: ViewportService,
        private readonly _api: ApiService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _searchService: SearchService
    ) {}

    ngOnInit(): void {
        APP_SEARCH_BAR_ID++;
        this.inputId = `app_search_bar_input_no_${APP_SEARCH_BAR_ID}`;
        this._api
            .fetchAliases()
            .then((data: AliasDto[]) => {
                this.knownAccounts = data;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    ngAfterViewInit(): void {
        this.inputElement = document.getElementById(this.inputId) as HTMLInputElement;
    }

    ngAfterViewChecked(): void {
        if (this.onlyFocusWhenActivelySearching && this.matchingAccounts.length === 0) {
            return;
        }
        if (this.trigger.menuOpen || this.vp.sm) {
            this.inputElement.focus();
        }
    }

    filterOrSearch(e: KeyboardEvent): void {
        this.matchingAccounts = [];
        const value = e.target['value'].toLowerCase();

        if (!value) {
            return this.trigger.closeMenu();
        }

        if (e.key === 'Escape' || e.keyCode === 27) {
            this.inputElement.blur();
            this.inputElement.value = '';
            return this.trigger.closeMenu();
        }

        // Handle Enter Key
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (this._searchService.isValidAddress(value) || this._searchService.isValidBlock(value)) {
                return this.emitSearch(value);
            }

            // Match aliases, then if there's a single match, search for it.
            this._matchAliases(value);
            if (this.matchingAccounts.length === 1) {
                this.emitSearch(this.matchingAccounts[0].address);
            }
        } else {
            this._matchAliases(value);
        }
    }

    emitSearch(value: string): void {
        this._searchService.emitSearch(value, false);
        this.closeSearch.emit();
        this.trigger.closeMenu();
        this.matchingAccounts = [];
        this.inputElement.blur();
        this.inputElement.value = '';
    }

    preventEmptyMenu(): void {
        if (this.matchingAccounts.length === 0) {
            this.trigger.closeMenu();
        }
    }

    private _matchAliases(value: string): void {
        this.knownAccounts.map((account) => {
            if (account.alias.toLowerCase().includes(value)) {
                this.matchingAccounts.push(account);
            }
        });
        if (this.matchingAccounts.length > 0) {
            this.trigger.openMenu();
        } else {
            this.trigger.closeMenu();
        }
    }
}
