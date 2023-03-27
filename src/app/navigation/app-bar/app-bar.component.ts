import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DrawerStateService } from '@app/services/drawer-state/drawer-state.service';
import { APP_NAV_ITEMS } from '../nav-items';
import { LoadingService } from '@app/services/loading/loading.service';

@Component({
    selector: 'app-bar',
    template: `
        <div class="navigation-app-bar-container" responsive [class.isPranked]="isPranked">
            <mat-toolbar class="navigation-app-bar mat-elevation-z2" color="primary" responsive>
                <div style="display: flex; width: 100%; align-items: center">
                    <button *ngIf="vp.sm" mat-icon-button (click)="openDrawer.emit()" [style.marginRight.px]="16">
                        <mat-icon>menu</mat-icon>
                    </button>
                    <blui-spacer *ngIf="!vp.sm"></blui-spacer>
                    <a
                        responsive
                        style="display: flex; align-items: center"
                        class="navigation-toolbar-title"
                        [routerLink]="'/home'"
                    >
                        <img src="../../../assets/branding/creeper-on-dark-horizontal.svg" style="width: 150px" />
                    </a>

                    <div *ngIf="!vp.md && !vp.sm" [style.marginLeft.px]="vp.md ? 24 : 48">
                        <button
                            mat-button
                            (click)="router.navigate([pages.knownAccounts.route])"
                            [class.active]="router.url === '/' + pages.knownAccounts.route"
                        >
                            Known Accounts
                        </button>
                        <button
                            mat-button
                            (click)="router.navigate([pages.network.route])"
                            [class.active]="router.url === '/' + pages.network.route"
                        >
                            Network
                        </button>
                        <button
                            mat-button
                            (click)="router.navigate([pages.node.route])"
                            [class.active]="router.url === '/' + pages.node.route"
                        >
                            Node
                        </button>
                        <button
                            mat-button
                            (click)="router.navigate([pages.representatives.route])"
                            [class.active]="router.url === '/' + pages.representatives.route"
                        >
                            Representatives
                        </button>
                        <button
                            mat-button
                            (click)="router.navigate([pages.wallets.route])"
                            [class.active]="router.url === '/' + pages.wallets.route"
                        >
                            Wallets
                        </button>
                    </div>

                    <div *ngIf="vp.md" [style.marginLeft.px]="vp.md ? 24 : 48">
                        <button mat-button class="nav-menu-trigger" [matMenuTriggerFor]="accounts">Explore</button>
                        <mat-menu #accounts="matMenu">
                            <button mat-menu-item (click)="router.navigate([pages.knownAccounts.route])">
                                Known Accounts
                            </button>
                            <button mat-menu-item (click)="router.navigate([pages.representatives.route])">
                                Representatives
                            </button>
                            <button mat-menu-item (click)="router.navigate([pages.wallets.route])">Wallets</button>
                        </mat-menu>

                        <button mat-button class="nav-menu-trigger" [matMenuTriggerFor]="networkHealth">Status</button>
                        <mat-menu #networkHealth="matMenu">
                            <button mat-menu-item (click)="router.navigate([pages.network.route])">Network</button>
                            <button mat-menu-item (click)="router.navigate([pages.node.route])">Node</button>
                        </mat-menu>
                    </div>

                    <blui-spacer></blui-spacer>
                    <blui-spacer></blui-spacer>

                    <app-search-bar *ngIf="!vp.sm"></app-search-bar>
                    <button *ngIf="vp.sm" mat-icon-button (click)="openSearch()" [style.marginRight.px]="0">
                        <mat-icon>search</mat-icon>
                    </button>
                    <app-user-menu style="margin-right: 8px"></app-user-menu>
                    <blui-spacer *ngIf="!vp.sm"></blui-spacer>
                </div>
            </mat-toolbar>

            <mat-toolbar class="mobile-search-bar" [class.active]="hasToggledMobileSearch" responsive>
                <mat-toolbar-row style="display: flex; width: 100%; padding: 0 16px">
                    <button mat-icon-button disabled style="margin-left: -8px">
                        <mat-icon>search</mat-icon>
                    </button>

                    <app-search-bar
                        *ngIf="hasToggledMobileSearch"
                        style="display: flex; width: 100%; height: 40px"
                        (closeSearch)="hasToggledMobileSearch = false"
                    ></app-search-bar>
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
    @Input() toolbarTitle: string;
    @Input() isPranked: boolean;
    @Output() openDrawer: EventEmitter<void> = new EventEmitter<void>();

    isLoading = false;
    hasToggledMobileSearch = false;

    pages = APP_NAV_ITEMS;
    appbarSearchText: string;

    constructor(
        public vp: ViewportService,
        public router: Router,
        private readonly _title: Title,
        private readonly _meta: Meta,
        private readonly _viewportService: ViewportService,
        private readonly _stateService: DrawerStateService,
        private readonly _loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this._loadingService.searchEvents().subscribe((isLoading) => {
            this.isLoading = isLoading;
        });
    }

    openSearch(): void {
        this.hasToggledMobileSearch = true;
    }

    closeSearch(): void {
        this.appbarSearchText = '';
        this.hasToggledMobileSearch = false;
    }
}
