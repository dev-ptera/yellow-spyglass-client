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

@Component({
    selector: 'app-search-bar',
    template: `
        <input
            #inputElement
            [class.red]="trigger.menuOpen"
            [class.desktop-search-input]="!vp.sm"
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
    @ViewChild('inputElement') inputElement: ElementRef;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    @Input() toolbarTitle: string;
    @Output() closeSearch: EventEmitter<void> = new EventEmitter<void>();

    knownAccounts: AliasDto[] = [];
    matchingAccounts: AliasDto[] = [];

    appbarSearchText: string;
    pages = APP_NAV_ITEMS;

    constructor(
        public router: Router,
        public vp: ViewportService,
        private readonly _api: ApiService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _searchService: SearchService
    ) {}

    ngOnInit(): void {
        this._api
            .fetchAliases()
            .then((data: AliasDto[]) => {
                this.knownAccounts = data;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    ngAfterViewChecked(): void {
        if (this.trigger.menuOpen || this.vp.sm) {
            this.inputElement.nativeElement.focus();
        }
    }

    filterOrSearch(e: KeyboardEvent): void {
        this.matchingAccounts = [];
        const value = e.target['value'].toLowerCase();

        if (!value) {
            return this.trigger.closeMenu();
        }

        if (e.key === 'Escape' || e.keyCode === 27) {
            this.inputElement.nativeElement.blur();
            this.inputElement.nativeElement.value = '';
            return this.trigger.closeMenu();
        }

        // Handle Enter Key
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (this._isValidAddress(value) || this._isValidBlock(value)) {
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
        this.inputElement.nativeElement.blur();
        this.inputElement.nativeElement.value = '';
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

    private _isValidAddress(address: string): boolean {
        return address && address.length === 64 && address.startsWith('ban_');
    }

    private _isValidBlock(block: string): boolean {
        return block && block.length === 64;
    }
}
