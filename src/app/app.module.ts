import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { BookmarksModule } from '@app/pages/bookmarks/bookmarks.module';
import { KnownAccountsModule } from '@app/pages/known-accounts/known-accounts.module';
import { NodeMonitorModule } from '@app/pages/node-monitor/node-monitor.module';
import { RepresentativesModule } from '@app/pages/representatives/representatives.module';
import { WalletsModule } from '@app/pages/wallets/wallets.module';
import { NavigationModule } from './navigation/navigation.module';
import { NetworkModule } from '@app/pages/network/network.module';
import { VanityModule } from '@app/pages/vanity/vanity.module';
import { HomeModule } from '@app/pages/home/home.module';

@Component({
    selector: 'app-root',
    template: `<app-navigation></app-navigation>`,
})
export class AppComponent {}

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BookmarksModule,
        HttpClientModule,
        HomeModule,
        KnownAccountsModule,
        NavigationModule,
        NetworkModule,
        NodeMonitorModule,
        RepresentativesModule,
        RouterModule,
        VanityModule,
        WalletsModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
