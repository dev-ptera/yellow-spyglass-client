import { NgModule } from '@angular/core';

import { BookmarkButtonComponent } from './bookmark-button/bookmark-button.component';
import { CopyButtonComponent } from './copy-button/copy-button.component';
import { QrButtonComponent } from './qr-button/qr-button.component';
import { QrDialogComponent } from './qr-dialog/qr-dialog.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ErrorComponent } from './error/error.component';
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
