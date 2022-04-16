import { NgModule } from '@angular/core';
import { BookmarksComponent } from '@app/pages/bookmarks/bookmarks.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmptyStateModule } from '@brightlayer-ui/angular-components';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppCommonModule } from '@app/common/app-common.module';
import { MatInputModule } from '@angular/material/input';
import { DeleteBookmarkDialog } from '@app/pages/bookmarks/delete-bookmark-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [BookmarksComponent, DeleteBookmarkDialog],
    entryComponents: [DeleteBookmarkDialog],
    imports: [
        AppCommonModule,
        CommonModule,
        EmptyStateModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatTableModule,
        MatInputModule,
        MatDialogModule,
        ReactiveFormsModule,
    ],
    exports: [BookmarksComponent, DeleteBookmarkDialog],
})
export class BookmarksModule {}
