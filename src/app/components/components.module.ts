import { NgModule } from '@angular/core';

// app
import { BookmarkButtonComponent } from '@app/components/bookmark-button/bookmark-button.component';
import { CopyButtonComponent } from '@app/components/copy-button/copy-button.component';
import { QrButtonComponent } from '@app/components/qr-button/qr-button.component';
import { QrDialogComponent } from '@app/components/qr-dialog/qr-dialog.component';
import { PaginatorComponent } from '@app/components/paginator/paginator.component';
import { ErrorComponent } from '@app/components/error/error.component';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateModule, SpacerModule } from '@pxblue/angular-components';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        BookmarkButtonComponent,
        CopyButtonComponent,
        QrButtonComponent,
        QrDialogComponent,
        PaginatorComponent,
        ErrorComponent,
    ],
    imports: [CommonModule, EmptyStateModule, MatButtonModule, MatIconModule, SpacerModule],
    entryComponents: [QrDialogComponent],
    exports: [
        BookmarkButtonComponent,
        CopyButtonComponent,
        QrButtonComponent,
        QrDialogComponent,
        PaginatorComponent,
        ErrorComponent,
    ],
})
export class ComponentsModule {}
