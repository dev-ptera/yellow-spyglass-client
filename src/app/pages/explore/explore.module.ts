import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//pxblue modules
import { InfoListItemModule, ListItemTagModule } from '@pxblue/angular-components';

//material modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

// app
import { AccountComponent } from './account/account.component';
import { ExploreComponent } from './explore.component';
import { SafeHtmlPipe } from '../../pipes/safe.pipe';
import { MatBadgeModule } from '@angular/material/badge';
import { ResponsiveDirective } from '../../directives/responsive.directive';

@NgModule({
    declarations: [AccountComponent, ExploreComponent, SafeHtmlPipe, ResponsiveDirective],
    imports: [
        CommonModule,
        InfoListItemModule,
        ListItemTagModule,
        MatBadgeModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        ReactiveFormsModule,
    ],
    exports: [AccountComponent, ExploreComponent, SafeHtmlPipe, ResponsiveDirective],
})
export class ExploreModule {}
