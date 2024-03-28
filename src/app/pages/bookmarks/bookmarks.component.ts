import { Component, OnInit } from '@angular/core';
import { Bookmark } from '@app/types/modal';
import { BookmarksService } from '@app/services/bookmarks/bookmarks.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBookmarkDialog } from '@app/pages/bookmarks/delete-bookmark-dialog.component';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';

@Component({
    selector: 'app-bookmarks',
    template: `
        <ng-container *transloco="let t; scope: 'bookmarks'; read: 'bookmarks'">
            <div class="app-page-root" responsive>
                <div class="app-page-content" *ngIf="bookmarks.length > 0">
                    <div class="app-page-title">{{ t('pageTitle') }}</div>

                    <div class="app-page-subtitle">
                        {{ t('pageDescription') }}
                    </div>
                    <table mat-table [style.width.%]="100" [dataSource]="bookmarks" class="mat-elevation-z2">
                        <ng-container matColumnDef="data">
                            <th mat-header-cell *matHeaderCellDef>{{ t('headers.bookmark') }}</th>
                            <td
                                mat-cell
                                [style.paddingTop.px]="8"
                                [style.paddingBottom.px]="8"
                                *matCellDef="let element"
                            >
                                <div class="bookmarks-data-cell" *ngIf="element.id !== currentEditId">
                                    <button
                                        mat-icon-button
                                        (click)="enableEditBookmark(element.id)"
                                        [style.marginRight.px]="16"
                                    >
                                        <mat-icon>edit</mat-icon>
                                    </button>
                                    <a
                                        class="bookmarks-data text link"
                                        [routerLink]="'/' + navItems.account.route + '/' + element.id"
                                    >
                                        {{ element.alias }}
                                    </a>
                                </div>
                                <div class="bookmarks-data-cell" *ngIf="element.id === currentEditId">
                                    <mat-form-field appearance="outline" style="width: 100%">
                                        <mat-label>{{ t('headers.alias') }}</mat-label>
                                        <input matInput name="address" autocomplete="off" [formControl]="formControl" />
                                    </mat-form-field>
                                </div>
                            </td>
                        </ng-container>
                        <ng-container matColumnDef="actions">
                            <th mat-header-cell [style.paddingLeft.px]="16" *matHeaderCellDef></th>
                            <td
                                mat-cell
                                [style.paddingLeft.px]="16"
                                *matCellDef="let element"
                                style="text-align: right"
                            >
                                <button
                                    *ngIf="element.id !== currentEditId"
                                    mat-stroked-button
                                    color="warn"
                                    (click)="openDeleteDialog(element.id, element.alias)"
                                >
                                    {{ t('delete') }}
                                </button>
                                <button
                                    *ngIf="element.id === currentEditId"
                                    style="margin-right: 16px; margin-bottom: 4px;"
                                    mat-flat-button
                                    color="primary"
                                    (click)="saveEdit(element.id)"
                                >
                                    {{ t('save') }}
                                </button>
                                <button
                                    *ngIf="element.id === currentEditId"
                                    mat-stroked-button
                                    color="primary"
                                    (click)="cancelEdit()"
                                >
                                    {{ t('cancel') }}
                                </button>
                            </td>
                        </ng-container>
                        <tr mat-header-row *matHeaderRowDef="columns"></tr>
                        <tr mat-row *matRowDef="let row; columns: columns"></tr>
                    </table>
                </div>
                <div style="display: flex; height: 100%; align-items: center">
                    <blui-empty-state
                        *ngIf="bookmarks.length === 0"
                        [title]="t('noBookmarksTitle')"
                        [description]="t('noBookmarksDescription')"
                    >
                        <mat-icon blui-empty-icon>bookmarks</mat-icon>
                    </blui-empty-state>
                </div>
            </div>
        </ng-container>
    `,
    styleUrls: ['./bookmarks.component.scss'],
})
export class BookmarksComponent implements OnInit {
    bookmarks: Bookmark[];
    columns = ['data', 'actions'];

    navItems = APP_NAV_ITEMS;

    currentEditId: string;
    formControl: FormControl = new FormControl();

    constructor(
        public vp: ViewportService,
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
