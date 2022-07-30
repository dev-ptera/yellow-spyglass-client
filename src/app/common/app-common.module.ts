import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { EmptyStateModule, SpacerModule } from '@brightlayer-ui/angular-components';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ResponsiveDirective } from '@app/common/directives/responsive.directive';
import { SafeHtmlPipe } from '@app/common/pipes/safe.pipe';
import { BookmarkButtonComponent } from '@app/common/components/bookmark-button/bookmark-button.component';
import { CopyButtonComponent } from '@app/common/components/copy-button/copy-button.component';
import { QrButtonComponent } from '@app/common/components/qr-button/qr-button.component';
import { QrDialogComponent } from '@app/common/components/qr-dialog/qr-dialog.component';
import { PaginatorComponent } from '@app/common/components/paginator/paginator.component';
import { ErrorComponent } from '@app/common/components/error/error.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommaPipe } from '@app/common/pipes/comma.directive';
import { PercentagePipe } from '@app/common/pipes/percentage.pipe';
import { CsvButtonComponent } from '@app/common/components/csv-button/csv-button.component';
import { FilterButtonComponent } from '@app/common/components/filter-button/filter-button.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { FilterDrawerComponent } from '@app/common/components/filter-drawer/filter-drawer.component';

@NgModule({
    declarations: [
        BookmarkButtonComponent,
        CsvButtonComponent,
        FilterButtonComponent,
        CommaPipe,
        CopyButtonComponent,
        QrButtonComponent,
        QrDialogComponent,
        PaginatorComponent,
        PercentagePipe,
        FilterDrawerComponent,
        ErrorComponent,
        ResponsiveDirective,
        SafeHtmlPipe,
    ],
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
    ],
    entryComponents: [QrDialogComponent],
    exports: [
        BookmarkButtonComponent,
        CsvButtonComponent,
        CommaPipe,
        CopyButtonComponent,
        QrButtonComponent,
        QrDialogComponent,
        PaginatorComponent,
        PercentagePipe,
        ErrorComponent,
        ResponsiveDirective,
        FilterDrawerComponent,
        FilterButtonComponent,
        SafeHtmlPipe,
    ],
})
export class AppCommonModule {}
