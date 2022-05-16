import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {ViewportService} from "@app/services/viewport/viewport.service";
import {Meta, Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {SearchService} from "@app/services/search/search.service";
import {DrawerStateService} from "@app/services/drawer-state/drawer-state.service";
import {APP_NAV_ITEMS} from "../nav-items";

@Component({
    selector: 'app-bar',
    template: `
        <div class="navigation-app-bar-container" responsive>
            <mat-toolbar class="navigation-app-bar mat-elevation-z2" color="primary" responsive>
                <div style="display: flex; width: 100%; align-items: center">
                    <button *ngIf="vp.sm" mat-icon-button (click)="openDrawer.emit()" [style.marginRight.px]="16">
                        <mat-icon>menu</mat-icon>
                    </button>
                    <div responsive class="navigation-toolbar-title" (click)="router.navigate(['/home'])">
                        {{ vp.sm ? toolbarTitle : 'Yellow Spyglass' }}
                    </div>
                    <blui-spacer></blui-spacer>
                    <div *ngIf="!vp.sm">
                        <button mat-button [matMenuTriggerFor]="accounts">Accounts</button>
                        <mat-menu #accounts="matMenu">
                            <button mat-menu-item (click)="router.navigate([pages.wallets.route])">Wallets</button>
                            <button mat-menu-item (click)="router.navigate([pages.knownAccounts.route])">Known
                                Accounts
                            </button>
                        </mat-menu>


                        <button mat-button [matMenuTriggerFor]="networkHealth">Network Health</button>
                        <mat-menu #networkHealth="matMenu">
                            <button mat-menu-item (click)="router.navigate([pages.representatives.route])">
                                Representatives
                            </button>
                            <button mat-menu-item (click)="router.navigate([pages.network.route])">Network</button>
                            <button mat-menu-item (click)="router.navigate([pages.node.route])">Node</button>
                        </mat-menu>
                    </div>


                    <blui-spacer></blui-spacer>
                    <blui-spacer></blui-spacer>
                    <blui-spacer></blui-spacer>

                    <input *ngIf="!vp.sm"
                           class="desktop-search-input"
                           type="text"
                           tabindex="0"
                           autocapitalize="none"
                           placeholder="Search Address or Transaction Hash"
                           [(ngModel)]="appbarSearchText"
                           (keyup)="appbarSearch($event)"
                    />
                    <button *ngIf="vp.sm" mat-icon-button (click)="openSearch()" [style.marginRight.px]="4">
                        <mat-icon>search</mat-icon>
                    </button>
                    <app-user-menu style="margin-right: 8px"></app-user-menu>
                </div>
            </mat-toolbar>

            <mat-toolbar class="navigation-search-bar" [class.active]="toggleSearch" responsive>
                <mat-toolbar-row style="padding: 0 16px" style="display: flex; width: 100%">
                    <button mat-icon-button disabled style="margin-left: -8px">
                        <mat-icon>search</mat-icon>
                    </button>
                    <input
                        class="search-control"
                        type="text"
                        tabindex="0"
                        autocapitalize="none"
                        placeholder="Search Address or Transaction Hash"
                        [(ngModel)]="appbarSearchText"
                        (keyup)="appbarSearch($event)"
                        #mobileSearchBar
                    />
                    <button mat-icon-button (click)="closeSearch()">
                        <mat-icon>close</mat-icon>
                    </button>
                </mat-toolbar-row>
            </mat-toolbar>
        </div>
    `,
    styleUrls: ['./app-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppBarComponent {

    @ViewChild('mobileSearchBar') searchBar: ElementRef;

    @Input() toolbarTitle: string;
    @Output() openDrawer: EventEmitter<void> = new EventEmitter<void>();

    appbarSearchText: string;
    toggleSearch = false;
    pages = APP_NAV_ITEMS;

    constructor(
        public vp: ViewportService,
        public router: Router,
        private readonly _title: Title,
        private readonly _meta: Meta,
        private readonly _searchService: SearchService,
        private readonly _viewportService: ViewportService,
        private readonly _stateService: DrawerStateService
    ) {
    }

    openSearch(): void {
        this.toggleSearch = true;
        // focus the input after the animation completes to avoid a jerky transition
        setTimeout(() => this.searchBar.nativeElement.focus(), 300);
    }

    appbarSearch(event: any): void {
        if (event.key === 'Enter') {
            this._searchService.emitSearch(this.appbarSearchText, false);
            this.closeSearch();
        }
    }

    closeSearch(): void {
        this.appbarSearchText = '';
        this.toggleSearch = false;
    }
}
