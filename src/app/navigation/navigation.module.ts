import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { DrawerLayoutModule, DrawerModule, UserMenuModule } from '@pxblue/angular-components';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { AppCommonModule } from '@app/common/app-common.module';
import { AppUserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
    declarations: [NavigationComponent, AppUserMenuComponent],
    imports: [
        AppCommonModule,
        BrowserAnimationsModule,
        CommonModule,
        DrawerLayoutModule,
        DrawerModule,
        MatButtonModule,
        MatToolbarModule,
        RouterModule,
        UserMenuModule,
    ],
    exports: [NavigationComponent, AppUserMenuComponent],
})
export class NavigationModule {}
