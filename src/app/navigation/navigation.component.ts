import { Component } from '@angular/core';
import { DrawerLayoutVariantType } from '@pxblue/angular-components';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewportService } from '../services/viewport/viewport.service';
import { DrawerStateService } from '../services/drawer-state/drawer-state.service';
import { APP_NAV_ITEMS, NavItem, EXPLORER_NAV_GROUP, NETWORK_NAV_GROUP } from './nav-items';
import { SearchService } from '@app/services/search/search.service';
import { ThemeService } from '@app/services/theme/theme.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
    toolbarTitle: string;
    routeListener: Subscription;
    variant: DrawerLayoutVariantType;

    navItems = APP_NAV_ITEMS;
    explorerNavGroup = EXPLORER_NAV_GROUP;
    networkNavGroup = NETWORK_NAV_GROUP;

    constructor(
        private readonly _router: Router,
        private readonly _searchService: SearchService,
        private readonly _viewportService: ViewportService,
        private readonly _stateService: DrawerStateService,
        public themeService: ThemeService
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

    // Observes route changes and determines which PXB Auth page to show via route name.
    private _listenForRouteChanges(): void {
        this.routeListener = this._router.events.subscribe((route) => {
            if (route instanceof NavigationEnd) {
                switch (route.urlAfterRedirects.split('?')[0]) {
                    case `/${APP_NAV_ITEMS.search.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.search.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.search.title);
                        break;
                    }
                    case `/${APP_NAV_ITEMS.page1.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.page1.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.page1.title);
                        break;
                    }
                    case `/${APP_NAV_ITEMS.representatives.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.representatives.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.representatives.title);
                        break;
                    }
                    case `/${APP_NAV_ITEMS.page2.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.page2.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.page2.title);
                        break;
                    }
                    case `/${APP_NAV_ITEMS.bookmarks.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.bookmarks.title;
                        this._stateService.setSelectedItem(undefined);
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
