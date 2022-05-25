import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { DrawerLayoutModule, DrawerModule, EmptyStateModule, UserMenuModule } from '@brightlayer-ui/angular-components';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { AppCommonModule } from '@app/common/app-common.module';
import { AppUserMenuComponent } from './user-menu/user-menu.component';
import { FormsModule } from '@angular/forms';
import { AppBarComponent } from './app-bar/app-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    declarations: [NavigationComponent, AppUserMenuComponent, AppBarComponent],
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
        MatProgressBarModule,
    ],
    exports: [NavigationComponent, AppUserMenuComponent, AppBarComponent],
})
export class NavigationModule {}
