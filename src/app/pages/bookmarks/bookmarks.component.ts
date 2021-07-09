import { Component, OnInit } from '@angular/core';
import { Bookmark } from '@app/types/modal';
import { BookmarksService } from '@app/services/bookmarks/bookmarks.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { FormControl } from '@angular/forms';
import { SearchService } from '@app/services/search/search.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBookmarkDialog } from '@app/pages/bookmarks/delete-bookmark-dialog.component';

@Component({
    selector: 'app-bookmarks',
    template: `
        <div class="bookmarks-root" responsive>
            <div class="bookmarks-body" *ngIf="bookmarks.length > 0">
                <div class="bookmarks-title" [class.mat-display-2]="!vp.sm" [class.mat-display-1]="vp.sm">
                    Bookmarks
                </div>

                <div class="mat-subheading-2 bookmarks-subtitle">
                    Bookmarks allow you to quickly save addresses or transactions. Manage your bookmarks below.
                </div>
                <table mat-table [style.width.%]="100" [dataSource]="bookmarks" class="mat-elevation-z4">
                    <ng-container matColumnDef="data">
                        <th mat-header-cell *matHeaderCellDef>Bookmark</th>
                        <td mat-cell [style.paddingTop.px]="8" [style.paddingBottom.px]="8" *matCellDef="let element">
                            <div class="bookmarks-data-cell" *ngIf="element.id !== currentEditId">
                                <button
                                    mat-icon-button
                                    (click)="enableEditBookmark(element.id)"
                                    [style.marginRight.px]="16"
                                >
                                    <mat-icon>edit</mat-icon>
                                </button>
                                <span class="bookmarks-data" (click)="searchService.emitSearch(element.id)">
                                    {{ element.alias }}
                                </span>
                            </div>
                            <div class="bookmarks-data-cell" *ngIf="element.id === currentEditId">
                                <mat-form-field appearance="outline" style="width: 100%">
                                    <mat-label>Alias</mat-label>
                                    <input matInput name="address" autocomplete="off" [formControl]="formControl" />
                                </mat-form-field>
                            </div>
                        </td>
                    </ng-container>
                    <ng-container matColumnDef="actions">
                        <th mat-header-cell [style.paddingLeft.px]="16" *matHeaderCellDef></th>
                        <td mat-cell [style.paddingLeft.px]="16" *matCellDef="let element" style="text-align: right">
                            <button
                                *ngIf="element.id !== currentEditId"
                                mat-stroked-button
                                color="warn"
                                (click)="openDeleteDialog(element.id, element.alias)"
                            >
                                Delete
                            </button>
                            <button
                                *ngIf="element.id === currentEditId"
                                style="margin-right: 16px; margin-bottom: 4px;"
                                mat-flat-button
                                color="primary"
                                (click)="saveEdit(element.id)"
                            >
                                Save
                            </button>
                            <button
                                *ngIf="element.id === currentEditId"
                                mat-stroked-button
                                color="primary"
                                (click)="cancelEdit()"
                            >
                                Cancel
                            </button>
                        </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="columns"></tr>
                    <tr mat-row *matRowDef="let row; columns: columns"></tr>
                </table>
            </div>
            <div style="display: flex; height: 100%; align-items: center">
                <pxb-empty-state
                    *ngIf="bookmarks.length === 0"
                    title="No Bookmarks Found"
                    description="To add a bookmark, search an address or transaction hash and save it."
                >
                    <mat-icon pxb-empty-icon>bookmarks</mat-icon>
                </pxb-empty-state>
            </div>
        </div>
    `,
    styleUrls: ['./bookmarks.component.scss'],
})
export class BookmarksComponent implements OnInit {
    bookmarks: Bookmark[];
    columns = ['data', 'actions'];

    currentEditId: string;
    formControl: FormControl = new FormControl();

    constructor(
        public vp: ViewportService,
        public searchService: SearchService,
        private readonly _dialog: MatDialog,
        private readonly _bookmarkService: BookmarksService
    ) {}

    ngOnInit(): void {
        this.bookmarks = this._bookmarkService.getBookmarks();
    }

    openDeleteDialog(id: string, alias: string): void {
        const dialogRef = this._dialog.open(DeleteBookmarkDialog, {
            data: {
                alias,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._bookmarkService.removeBookmark(id);
                this.bookmarks = this._bookmarkService.getBookmarks();
            }
        });
    }

    enableEditBookmark(id: string): void {
        this.currentEditId = id;
        for (const bookmark of this.bookmarks) {
            if (bookmark.id === id) {
                this.formControl.setValue(bookmark.alias);
                break;
            }
        }
    }

    cancelEdit(): void {
        this.currentEditId = undefined;
        this.formControl.setValue('');
    }

    saveEdit(id: string): void {
        this._bookmarkService.removeBookmark(id);
        this._bookmarkService.addBookmark({
            id,
            alias: this.formControl.value,
        });
        this.bookmarks = this._bookmarkService.getBookmarks();
        this.cancelEdit();
    }
}
