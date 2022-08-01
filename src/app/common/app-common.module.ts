import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { EmptyStateModule, SpacerModule } from '@brightlayer-ui/angular-components';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ResponsiveDirective } from '@app/common/directives/responsive.directive';
import { SafeHtmlPipe } from '@app/common/pipes/safe.pipe';
import { PaginatorComponent } from '@app/common/components/paginator/paginator.component';
import { ErrorComponent } from '@app/common/components/error/error.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommaPipe } from '@app/common/pipes/comma.directive';
import { PercentagePipe } from '@app/common/pipes/percentage.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [CommaPipe, PaginatorComponent, PercentagePipe, ErrorComponent, ResponsiveDirective, SafeHtmlPipe],
    imports: [
        CommonModule,
        EmptyStateModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        SpacerModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatDividerModule,
        MatCheckboxModule,
        FormsModule,
        MatProgressSpinnerModule,
    ],
    exports: [CommaPipe, PaginatorComponent, PercentagePipe, ErrorComponent, ResponsiveDirective, SafeHtmlPipe],
})
export class AppCommonModule {}
