import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_NAV_ITEMS } from './navigation/nav-items';
import { BookmarksComponent } from '@app/pages/bookmarks/bookmarks.component';
import { RepresentativesComponent } from '@app/pages/representatives/representatives.component';
import { NodeMonitorComponent } from '@app/pages/node-monitor/node-monitor.component';
import { WalletsComponent } from '@app/pages/wallets/wallets.component';
import { KnownAccountsComponent } from '@app/pages/known-accounts/known-accounts.component';
import { NetworkComponent } from '@app/pages/network/network.component';
import { VanityComponent } from '@app/pages/vanity/vanity.component';
import { HomeComponent } from '@app/pages/home/home.component';
import { AccountComponent } from '@app/pages/account/account.component';
import { BlockComponent } from '@app/pages/block/block.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: APP_NAV_ITEMS.representatives.route, component: RepresentativesComponent },
    { path: APP_NAV_ITEMS.bookmarks.route, component: BookmarksComponent },
    { path: APP_NAV_ITEMS.node.route, component: NodeMonitorComponent },
    { path: APP_NAV_ITEMS.wallets.route, component: WalletsComponent },
    { path: APP_NAV_ITEMS.knownAccounts.route, component: KnownAccountsComponent },
    { path: APP_NAV_ITEMS.network.route, component: NetworkComponent },
    { path: APP_NAV_ITEMS.vanity.route, component: VanityComponent },
    { path: `${APP_NAV_ITEMS.account.route}/:id`, component: AccountComponent },
    { path: `${APP_NAV_ITEMS.hash.route}/:id`, component: BlockComponent },

    // Handle Creeper Legacy Redirects
    { path: 'status', redirectTo: APP_NAV_ITEMS.node.route, pathMatch: 'full' },
    { path: `explorer/account/:id/history`, redirectTo: `${APP_NAV_ITEMS.account.route}/:id`, pathMatch: 'full' }, // Match Creeper path
    { path: `explorer/account/:id`, redirectTo: `${APP_NAV_ITEMS.account.route}/:id`, pathMatch: 'full' }, // Match Creeper path
    { path: `explorer/block/:id`, redirectTo: `${APP_NAV_ITEMS.hash.route}/:id`, pathMatch: 'full' }, // Match Creeper path
    { path: `explorer/hash/:id`, redirectTo: `${APP_NAV_ITEMS.hash.route}/:id`, pathMatch: 'full' }, // Match Creeper path
    { path: `explorer/auto/:id`, redirectTo: `${APP_NAV_ITEMS.hash.route}/:id`, pathMatch: 'full' }, // Match Creeper path

    // Catch all
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
