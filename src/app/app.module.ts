import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { ExploreModule } from './pages/explore/explore.module';
import { BookmarksModule } from '@app/pages/bookmarks/bookmarks.module';
import { KnownAccountsModule } from '@app/pages/known-accounts/known-accounts.module';
import { NodeMonitorModule } from '@app/pages/node-monitor/node-monitor.module';
import { RepresentativesModule } from '@app/pages/representatives/representatives.module';
import { WalletsModule } from '@app/pages/wallets/wallets.module';
import { NavigationModule } from './navigation/navigation.module';
import { NetworkModule } from '@app/pages/network/network.module';

@Component({
    selector: 'app-root',
    template: `<app-navigation></app-navigation>`,
})
export class AppComponent {
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BookmarksModule,
        ExploreModule,
        HttpClientModule,
        KnownAccountsModule,
        NavigationModule,
        NetworkModule,
        NodeMonitorModule,
        RepresentativesModule,
        RouterModule,
        WalletsModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
