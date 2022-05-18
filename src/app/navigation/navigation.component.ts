import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewportService } from '../services/viewport/viewport.service';
import { DrawerStateService } from '../services/drawer-state/drawer-state.service';
import { APP_NAV_ITEMS, NavItem, EXPLORER_NAV_GROUP, NETWORK_NAV_GROUP } from './nav-items';
import { SearchService } from '@app/services/search/search.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
    appbarSearchText = '';
    toolbarTitle: string;
    routeListener: Subscription;

    explorerNavGroup = EXPLORER_NAV_GROUP;
    networkNavGroup = NETWORK_NAV_GROUP;

    constructor(
        public vp: ViewportService,
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
        this._searchService.searchEvents().subscribe((data: { search: string; openInNewWindow: boolean }) => {
            if (data.openInNewWindow) {
                if (data.search.startsWith('ban_')) {
                    window.open(`https://yellowspyglass.com/${APP_NAV_ITEMS.account.route}/${data.search}`, '_blank');
                } else {
                    window.open(`https://yellowspyglass.com/${APP_NAV_ITEMS.hash.route}/${data.search}`, '_blank');
                }
            } else {
                if (data.search.startsWith('ban_')) {
                    void this._router.navigate([`${APP_NAV_ITEMS.account.route}/${data.search}`]);
                } else {
                    void this._router.navigate([`${APP_NAV_ITEMS.hash.route}/${data.search}`]);
                }
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
        this._stateService.setDrawerOpen(false);
    }

    getSelectedItem(): string {
        return this._stateService.getSelectedItem();
    }

    closeDrawer(): void {
        this._stateService.setDrawerOpen(false);
    }

    openDrawer(): void {
        this._stateService.setDrawerOpen(true);
    }

    isHome(): boolean {
        return this._router.url === '/';
    }

    // Observes route changes and changes app title & sets selected item
    private _listenForRouteChanges(): void {
        this.routeListener = this._router.events.subscribe((route) => {
            if (route instanceof NavigationEnd) {
                window.scrollTo(0, 0);
                const drawerContent = document.getElementsByClassName('mat-sidenav-content')[0];
                if (drawerContent) {
                    drawerContent.scroll(0, 0);
                }

                switch (route.urlAfterRedirects.replace('explorer/', '').split('/')[1]) {
                    case `${APP_NAV_ITEMS.home.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.home.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.home.title);
                        this._title.setTitle(this._makeTitle('Explore'));
                        this._meta.updateTag({
                            name: 'description',
                            content:
                                'Search banano addresses or transaction hashes; explore the open seas of the banano network',
                        });
                        break;
                    }
                    case `explorer/${APP_NAV_ITEMS.account.route}`: {
                        this._updateAccountPageMetadata();
                        break;
                    }
                    case `${APP_NAV_ITEMS.account.route}`: {
                        this._updateAccountPageMetadata();
                        break;
                    }
                    case `explorer/${APP_NAV_ITEMS.hash.route}`: {
                        this._updateHashPageMetadata();
                        break;
                    }
                    case `${APP_NAV_ITEMS.hash.route}`: {
                        this._updateHashPageMetadata();
                        break;
                    }
                    case `${APP_NAV_ITEMS.representatives.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.representatives.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.representatives.title);
                        this._title.setTitle(this._makeTitle('Representatives'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'Search banano representatives, online offline reps, voting weight distribution',
                        });
                        break;
                    }
                    case `${APP_NAV_ITEMS.network.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.network.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.network.title);
                        this._title.setTitle(this._makeTitle('Network'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'Banano network status, confirmation quorum, online representatives',
                        });
                        break;
                    }
                    case `${APP_NAV_ITEMS.bookmarks.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.bookmarks.title;
                        this._stateService.setSelectedItem(undefined);
                        this._title.setTitle(this._makeTitle('Bookmarks'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'Save and name address or transaction hashes as bookmarks',
                        });
                        break;
                    }
                    case `status`: {
                        this._updateNodePageMetadata();
                        break;
                    }
                    case `${APP_NAV_ITEMS.node.route}`: {
                        this._updateNodePageMetadata();
                        break;
                    }
                    case `${APP_NAV_ITEMS.wallets.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.wallets.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.wallets.title);
                        this._title.setTitle(this._makeTitle('Wallets'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'See banano distribution by account, top banano holders, rich list',
                        });
                        break;
                    }
                    case `${APP_NAV_ITEMS.knownAccounts.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.knownAccounts.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.knownAccounts.title);
                        this._title.setTitle(this._makeTitle('Known Accounts'));
                        this._meta.updateTag({
                            name: 'description',
                            content:
                                'Known banano accounts, banano exchanges, banano games, banano developer / owner accounts',
                        });
                        break;
                    }
                    case `${APP_NAV_ITEMS.vanity.route}`: {
                        this.toolbarTitle = APP_NAV_ITEMS.vanity.title;
                        this._stateService.setSelectedItem(APP_NAV_ITEMS.vanity.title);
                        this._title.setTitle(this._makeTitle('Vanity MonKeys'));
                        this._meta.updateTag({
                            name: 'description',
                            content: 'Banano addresses with custom vanity monKeys.',
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

    private _updateAccountPageMetadata(): void {
        this.toolbarTitle = APP_NAV_ITEMS.account.title;
        this._title.setTitle(this._makeTitle('Account'));
        this._meta.updateTag({
            name: 'description',
            content: 'Explore account transaction history and delegators.',
        });
    }

    private _updateHashPageMetadata(): void {
        this.toolbarTitle = APP_NAV_ITEMS.hash.title;
        this._title.setTitle(this._makeTitle('Block'));
        this._meta.updateTag({
            name: 'description',
            content: 'See details for a specific block',
        });
    }

    private _updateNodePageMetadata(): void {
        this.toolbarTitle = APP_NAV_ITEMS.node.title;
        this._stateService.setSelectedItem(APP_NAV_ITEMS.node.title);
        this._title.setTitle(this._makeTitle('Node'));
        this._meta.updateTag({
            name: 'description',
            content: 'Node status for the Yellow Spyglass explorer; batman representative',
        });
    }

    private _makeTitle(page: string): string {
        return `Yellow Spyglass | ${page}`;
    }
}
