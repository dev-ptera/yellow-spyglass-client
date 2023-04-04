import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { AliasDto, DiscordResponseDto } from '@app/types/dto';
import { SearchService } from '@app/services/search/search.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { environment } from '../../../environments/environment';
import { AliasService } from '@app/services/alias/alias.service';

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
            (keyup)="handleKeystroke($event)"
            #trigger="matMenuTrigger"
            [matMenuTriggerFor]="menu"
        />

        <mat-menu #menu="matMenu" class="alias-search-menu">
            <ng-container *ngFor="let item of matchingAccounts; let i = index">
                <a
                    style="text-decoration: unset;"
                    [routerLink]="createRouterLinkForMenuItem(item.address)"
                    (click)="handleMenuItemClick($event)"
                >
                    <button
                        mat-menu-item
                        [class.yellow]="menuActiveIndex === i"
                        [innerHTML]="item.alias | boldSearch: inputElement.value"
                    ></button>
                </a>
            </ng-container>
        </mat-menu>
    `,
    styleUrls: ['./search-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    @Input() placeholder: string = 'Search by Address, Block or Alias';
    @Input() toolbarTitle: string;

    /** This input is used to turn off the autofocus logic. Home page search does not need autofocus, but app-bar search does. */
    @Input() onlyFocusWhenActivelySearching: boolean;

    @Output() closeSearch: EventEmitter<void> = new EventEmitter<void>();

    /** Emits whenever a search value is neither a hash, discord id, alias, nor address.  Only used on the home page. */
    @Output() invalidSearch: EventEmitter<void> = new EventEmitter<void>();

    matchingAccounts: AliasDto[] = [];

    appbarSearchText: string;
    menuActiveIndex = 0;

    inputId: string;
    inputElement: HTMLInputElement;

    constructor(
        public vp: ViewportService,
        private readonly _api: ApiService,
        private readonly _searchService: SearchService,
        public aliasService: AliasService
    ) {}

    ngOnInit(): void {
        APP_SEARCH_BAR_ID++;
        this.inputId = `app_search_bar_input_no_${APP_SEARCH_BAR_ID}`;
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

    handleKeystroke(e: KeyboardEvent): void {
        this._filterOrSearch(e);
    }

    preventEmptyMenu(): void {
        if (this.matchingAccounts.length === 0) {
            this._closeMenu();
        }
    }

    createRouterLinkForMenuItem(address: string): string {
        return `/account/${address}`;
    }

    /** Call this method to manually search based off of current input field value. */
    searchCurrentValue(controlKey: boolean, e?: KeyboardEvent): void {
        const value = this.appbarSearchText ? this.appbarSearchText.trim() : '';

        // Handle Empty Case
        if (!value) {
            return this.invalidSearch.emit();
        }

        if (this._searchService.isValidAddress(value) || this._searchService.isValidBlock(value)) {
            return this._emitSearch(value, controlKey);
        }

        // Match aliases, then if there's a single match, search for it.
        this._matchAliases();
        const match = this.matchingAccounts[this.menuActiveIndex];
        if (match) {
            // If the user has hit the enter key, this assumes the menu is open & they have selected an item via key traversal.
            if (this._isEnterKey(e)) {
                this._emitSearch(match.address);
                // Otherwise the input should be specific enough that it matches a single account.
            } else if (this.matchingAccounts.length === 1) {
                this._emitSearch(match.address);
            }
        }

        // BRPD feature only - given a discord user id, searches their address.
        if (environment.brpd) {
            this._api
                .fetchDiscordWalletFromUserId(value)
                .then((data: DiscordResponseDto[]) => {
                    this._emitSearch(data[0].address);
                })
                .catch((err) => {
                    console.error(err);
                    // Not a valid search.
                    this.invalidSearch.emit();
                });
        } else {
            // Not a valid search.
            this.invalidSearch.emit();
        }
    }

    private _emitSearch(value: string, ctrl = false): void {
        this._searchService.emitSearch(value, ctrl);
        this._dismissMenu();
    }

    handleMenuItemClick(e: MouseEvent): void {
        if (!e.ctrlKey) {
            this._dismissMenu();
        }
    }

    private _dismissMenu(): void {
        this._closeMenu();
        this.closeSearch.emit();
        this.matchingAccounts = [];
        this.inputElement.blur();
    }

    private _filterOrSearch(e: KeyboardEvent): void {
        const value = this.appbarSearchText || '';

        // Handle Empty Case
        if (!value || !e) {
            return this._closeMenu();
        }

        // Dismiss Menu & Clear Value
        if (e.key === 'Escape' || e.keyCode === 27) {
            this.inputElement.blur();
            this.inputElement.value = '';
            return this._closeMenu();
        }

        // Handle Enter Key
        if (this._isEnterKey(e)) {
            return this.searchCurrentValue(false, e);
        }

        // Travel List
        if (this._isTraversalKeystroke(e)) {
            return this._traverseMenuViaKeyboard(e);
        }

        // Input value has changed
        this._matchAliases();
    }

    private _isTraversalKeystroke(e: KeyboardEvent): boolean {
        return e.key === 'ArrowDown' || e.key === 'Tab' || e.key === 'ArrowUp';
    }

    /** Handles keyboard traversal of the matching menu, responding to KeyUp, KeyDown, & Tab events. */
    private _traverseMenuViaKeyboard(e: KeyboardEvent): void {
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

    private _isEnterKey(e: KeyboardEvent): boolean {
        return e && (e.key === 'Enter' || e.keyCode === 13);
    }

    /** Based on current input value, filters the list of known accounts.
     * If there are matches, it presents the menu overlay.  Otherwise, it closes the menu. */
    private _matchAliases(): void {
        const value = (this.appbarSearchText || '').toLowerCase();
        this.matchingAccounts = [];
        this.aliasService.aliases.map((account) => {
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
