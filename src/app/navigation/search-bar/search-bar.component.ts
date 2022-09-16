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
import { ApiService } from '@app/services/api/api.service';
import { AliasDto, DiscordResponseDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { environment } from '../../../environments/environment';

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
            autocomplete="off"
            [placeholder]="placeholder"
            [(ngModel)]="appbarSearchText"
            (click)="preventEmptyMenu()"
            (keyup)="filterOrSearch($event); traverseList($event)"
            #trigger="matMenuTrigger"
            [matMenuTriggerFor]="menu"
        />

        <mat-menu #menu="matMenu" class="alias-search-menu">
            <button
                mat-menu-item
                *ngFor="let item of matchingAccounts; let i = index"
                (click)="emitSearch(item.address)"
                [class.yellow]="menuActiveIndex === i"
                [innerHTML]="item.alias | boldSearch: inputElement.value"
            ></button>
        </mat-menu>
    `,
    styleUrls: ['./search-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent {
    @ViewChild('mobileSearchBar') searchBar: ElementRef;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    @Input() placeholder: string = 'Search by Address, Block or Alias';
    @Input() toolbarTitle: string;

    /** This input is used to turn off the auto-focus logic, only used when the input is being actively used. */
    @Input() onlyFocusWhenActivelySearching: boolean;
    @Output() closeSearch: EventEmitter<void> = new EventEmitter<void>();
    @Output() searchInputChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() enterPressed: EventEmitter<string> = new EventEmitter<string>();

    knownAccounts: AliasDto[] = [];
    matchingAccounts: AliasDto[] = [];

    appbarSearchText: string;
    menuActiveIndex = 0;

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
        this.searchInputChange.emit(value);

        if (!value) {
            return this._closeMenu();
        }

        if (e.key === 'Escape' || e.keyCode === 27) {
            this.inputElement.blur();
            this.inputElement.value = '';
            return this._closeMenu();
        }

        // Handle Enter Key
        if (e.key === 'Enter' || e.keyCode === 13) {
            this.enterPressed.emit(value);
            console.log('pressed enter');
            if (this._searchService.isValidAddress(value) || this._searchService.isValidBlock(value)) {
                return this.emitSearch(value);
            }

            // Match aliases, then if there's a single match, search for it.
            this._matchAliases(value);
            const match = this.matchingAccounts[this.menuActiveIndex];
            if (match) {
                this.emitSearch(match.address);
            }

            // BRPD feature only - given a user id, searches their address.
            if (environment.brpd) {
                this._api
                    .fetchDiscordWalletFromUserId(value)
                    .then((data: DiscordResponseDto[]) => {
                        this.emitSearch(data[0].address);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        } else {
            this._matchAliases(value);
        }
    }

    traverseList(e: KeyboardEvent): void {
        const menuEl = document.getElementsByClassName('alias-search-menu')[0];
        if (e.key === 'ArrowDown' || e.key === 'Tab') {
            if (this.menuActiveIndex < this.matchingAccounts.length - 1) {
                this.menuActiveIndex++;
            }
        }
        if (e.key === 'ArrowUp') {
            if (this.menuActiveIndex !== 0) {
                this.menuActiveIndex--;
            }
        }
        if (menuEl) {
            const scrollDistance = 48 * this.menuActiveIndex - 48 * 3;
            menuEl.scrollTop = scrollDistance;
        }
    }

    emitSearch(value: string): void {
        this._searchService.emitSearch(value, false);
        this.closeSearch.emit();
        this._closeMenu();
        this.matchingAccounts = [];
        this.inputElement.blur();
        // this.inputElement.value = 'test';
    }

    preventEmptyMenu(): void {
        if (this.matchingAccounts.length === 0) {
            this._closeMenu();
        }
    }

    private _matchAliases(value: string): void {
        this.knownAccounts.map((account) => {
            if (!account.alias) {
                return;
            }

            if (account.alias.toLowerCase().includes(value)) {
                this.matchingAccounts.push(account);
            }
        });
        if (this.matchingAccounts.length > 0) {
            this.trigger.openMenu();
        } else {
            this._closeMenu();
        }
    }

    private _closeMenu(): void {
        this.menuActiveIndex = 0;
        this.trigger.closeMenu();
    }
}
