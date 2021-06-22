import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { DrawerLayoutModule, DrawerModule } from '@pxblue/angular-components';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { AppCommonModule } from '@app/common/app-common.module';

@NgModule({
    declarations: [NavigationComponent],
    imports: [
        AppCommonModule,
        BrowserAnimationsModule,
        CommonModule,
        DrawerLayoutModule,
        DrawerModule,
        MatButtonModule,
        MatToolbarModule,
        RouterModule,
    ],
    exports: [NavigationComponent],
})
export class NavigationModule {}
