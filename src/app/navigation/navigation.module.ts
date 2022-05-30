import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './navigation.component';
import {DrawerLayoutModule, DrawerModule, EmptyStateModule, UserMenuModule} from '@brightlayer-ui/angular-components';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {AppCommonModule} from '@app/common/app-common.module';
import {AppUserMenuComponent} from './user-menu/user-menu.component';
import {FormsModule} from '@angular/forms';
import {AppBarComponent} from './app-bar/app-bar.component';
import {MatMenuModule} from '@angular/material/menu';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {BoldSearchPipe} from "./search-bar/bold-search.pipe";

@NgModule({
    declarations: [NavigationComponent, AppUserMenuComponent, AppBarComponent, SearchBarComponent, BoldSearchPipe],
    imports: [
        AppCommonModule,
        BrowserAnimationsModule,
        CommonModule,
        DrawerLayoutModule,
        DrawerModule,
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule,
        RouterModule,
        UserMenuModule,
        FormsModule,
        EmptyStateModule,
        MatMenuModule,
    ],
    exports: [NavigationComponent, AppUserMenuComponent, AppBarComponent, SearchBarComponent, BoldSearchPipe],
})
export class NavigationModule {}
