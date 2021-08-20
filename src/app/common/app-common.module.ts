import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { EmptyStateModule, SpacerModule } from '@pxblue/angular-components';
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
import { CommaPipe } from '@app/common/directives/comma.directive';
import { PercentagePipe } from '@app/common/pipes/percentage.pipe';
import { WaveComponent } from '@app/common/components/wave/wave.component';

@NgModule({
    declarations: [
        BookmarkButtonComponent,
        CommaPipe,
        CopyButtonComponent,
        QrButtonComponent,
        QrDialogComponent,
        PaginatorComponent,
        PercentagePipe,
        ErrorComponent,
        ResponsiveDirective,
        SafeHtmlPipe,
        WaveComponent,
    ],
    imports: [CommonModule, EmptyStateModule, MatButtonModule, MatIconModule, MatSnackBarModule, SpacerModule],
    entryComponents: [QrDialogComponent],
    exports: [
        BookmarkButtonComponent,
        CommaPipe,
        CopyButtonComponent,
        QrButtonComponent,
        QrDialogComponent,
        PaginatorComponent,
        PercentagePipe,
        ErrorComponent,
        ResponsiveDirective,
        SafeHtmlPipe,
        WaveComponent,
    ],
})
export class AppCommonModule {}
