import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_NAV_ITEMS } from './navigation/nav-items';
import { ExploreComponent } from './pages/explore/explore.component';
import { BookmarksComponent } from '@app/pages/bookmarks/bookmarks.component';
import { RepresentativesComponent } from '@app/pages/representatives/representatives.component';
import { NodeMonitorComponent } from '@app/pages/node-monitor/node-monitor.component';
import { WalletsComponent } from '@app/pages/wallets/wallets.component';
import { KnownAccountsComponent } from '@app/pages/known-accounts/known-accounts.component';
import { NetworkComponent } from '@app/pages/network/network.component';

const routes: Routes = [
    { path: '', redirectTo: APP_NAV_ITEMS.search.route, pathMatch: 'full' },
    { path: APP_NAV_ITEMS.search.route, component: ExploreComponent },
    { path: APP_NAV_ITEMS.representatives.route, component: RepresentativesComponent },
    { path: APP_NAV_ITEMS.bookmarks.route, component: BookmarksComponent },
    { path: APP_NAV_ITEMS.node.route, component: NodeMonitorComponent },
    { path: APP_NAV_ITEMS.wallets.route, component: WalletsComponent },
    { path: APP_NAV_ITEMS.knownAccounts.route, component: KnownAccountsComponent },
    { path: APP_NAV_ITEMS.network.route, component: NetworkComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
