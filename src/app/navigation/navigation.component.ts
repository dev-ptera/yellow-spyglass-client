import { Component, OnInit } from '@angular/core';
import { DrawerLayoutVariantType } from '@pxblue/angular-components';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewportService } from '../services/viewport/viewport.service';
import { DrawerStateService } from '../services/drawer-state/drawer-state.service';
import { APP_NAV_ITEMS, NavItem, EXPLORER_NAV_GROUP, NETWORK_NAV_GROUP } from './nav-items';
import { SearchService } from '@app/services/search/search.service';
import { ThemeService } from '@app/services/theme/theme.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    toolbarTitle: string;
    routeListener: Subscription;
    variant: DrawerLayoutVariantType;

    navItems = APP_NAV_ITEMS;
    explorerNavGroup = EXPLORER_NAV_GROUP;
    networkNavGroup = NETWORK_NAV_GROUP;

    constructor(
        public vp: ViewportService,
        public themeService: ThemeService,
        private readonly _title: Title,
        private readonly _meta: Meta,
        private readonly _router: Router,
        private readonly _searchService: SearchService,
        private readonly _viewportService: ViewportService,
        private readonly _stateService: DrawerStateService
    ) {
        this._listenForRouteChanges();
    }

    ngOnInit(): void {
        this._searchService.searchEvents().subscribe((searchValue: string) => {
            if (searchValue.startsWith('ban_')) {
                void this._router.navigate([APP_NAV_ITEMS.search.route], {
                    queryParams: { address: searchValue },
                });
            } else {
                void this._router.navigate([APP_NAV_ITEMS.search.route], {
                    queryParams: { hash: searchValue },
                });
            }
        });
    }

    navigate(url: string): void {
        void this._router.navigateByUrl(url);
    }

    isOpen(): boolean {
        return this._stateService.getDrawerOpen();
    }

    selectItem(navItem: NavItem): void {
        this.navigate(navItem.route);
        if (this.isSmall()) {
            this._stateService.setDrawerOpen(false);
        }
    }

    toggleDrawerOpen(): void {
        this._stateService.setDrawerOpen(!this._stateService.getDrawerOpen());
    }

    closeDrawer(): void {
        this._stateService.setDrawerOpen(false);
    }

    openDrawer(): void {
        this._stateService.setDrawerOpen(true);
    }

    getSelectedItem(): string {
        return this._stateService.getSelectedItem();
    }

    isSmall(): boolean {
        return this._viewportService.isMedium() || this._viewportService.isSmall();
    }

    private makeTitle(page: string): string {
        return `Yellow Spyglass | ${page}`;
    }

    // Observes route changes and determines which PXB Auth page to show via route name.
    private _listenForRouteChanges(): void {
        this.routeListener = this._router.events.subscribe((route) => {
            if (route instanceof NavigationEnd) {
                window.scrollTo(0, 0);
                switch (route.urlAfterRedirects.split('?')[0]) {
                    case `/${APP_NAV_ITEMS.search.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.search.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.search.title);
                        this._title.setTitle(this.makeTitle('Explore'));
                        this._meta.updateTag({
                            name: 'description',
                            content:
                                'Search banano addresses or transaction hashes; explore the open seas of the banano network',
                        });
                        break;
                    }
                    case `/${APP_NAV_ITEMS.representatives.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.representatives.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.representatives.title);
                        this._title.setTitle(this.makeTitle('Representatives'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'Search banano representatives, online offline reps, voting weight distribution',
                        });
                        break;
                    }
                    case `/${APP_NAV_ITEMS.network.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.network.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.network.title);
                        this._title.setTitle(this.makeTitle('Network'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'Banano network status, confirmation quorum, online representatives',
                        });
                        break;
                    }
                    case `/${APP_NAV_ITEMS.bookmarks.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.bookmarks.title;
                        this._stateService.setSelectedItem(undefined);
                        this._title.setTitle(this.makeTitle('Bookmarks'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'Save and name address or transaction hashes as bookmarks',
                        });
                        break;
                    }
                    case `/${APP_NAV_ITEMS.node.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.node.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.node.title);
                        this._title.setTitle(this.makeTitle('Node'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'Node status for the Yellow Spyglass explorer; batman representative',
                        });
                        break;
                    }
                    case `/${APP_NAV_ITEMS.wallets.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.wallets.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.wallets.title);
                        this._title.setTitle(this.makeTitle('Wallets'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'See banano distribution by account, top banano holders, rich list',
                        });
                        break;
                    }
                    case `/${APP_NAV_ITEMS.knownAccounts.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.knownAccounts.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.knownAccounts.title);
                        this._title.setTitle(this.makeTitle('Known Accounts'));
                        this._meta.updateTag({
                            name: 'description',
                            content:
                                'Known banano accounts, banano exchanges, banano games, banano developer / owner accounts',
                        });
                        break;
                    }
                    default: {
                        this.toolbarTitle = '';
                    }
                }
            }
        });
    }

    getVariant(): DrawerLayoutVariantType {
        if (this.variant === 'persistent' && this.isSmall()) {
            this._stateService.setDrawerOpen(false);
        } else if (this.variant === 'temporary' && !this.isSmall()) {
            this._stateService.setDrawerOpen(true);
        }
        this.variant = this.isSmall() ? 'temporary' : 'persistent';
        return this.variant;
    }

    toggleTheme(): void {
        this.themeService.setTheme(!this.themeService.isLightMode());
    }
}
