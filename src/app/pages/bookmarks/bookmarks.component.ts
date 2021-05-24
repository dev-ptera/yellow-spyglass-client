import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { Bookmark } from '@app/types/modal';
import { BookmarksService } from '@app/services/bookmarks/bookmarks.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-bookmarks',
    template: `
        <div class="bookmarks-root" responsive>
            <ng-container *ngIf="bookmarks.length > 0">
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
                                <span class="bookmarks-data">{{ element.alias }}</span>
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
                                (click)="removeBookmark(element.id)"
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
                                color="accent"
                                (click)="cancelEdit()"
                            >
                                Cancel
                            </button>
                        </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="columns"></tr>
                    <tr mat-row *matRowDef="let row; columns: columns"></tr>
                </table>
            </ng-container>
            <pxb-empty-state
                *ngIf="bookmarks.length === 0"
                title="No Bookmarks Found"
                description="To add a bookmark, search an address or transaction hash and save it."
            >
                <mat-icon pxb-empty-icon>bookmarks</mat-icon>
            </pxb-empty-state>
        </div>
    `,
    styleUrls: ['./bookmarks.component.scss'],
})
export class BookmarksComponent {
    bookmarks: Bookmark[];
    columns = ['data', 'actions'];

    currentEditId: string;
    formControl: FormControl = new FormControl();

    constructor(private _bookmarkService: BookmarksService, public vp: ViewportService) {}

    ngOnInit(): void {
        this.bookmarks = this._bookmarkService.getBookmarks();
    }

    removeBookmark(id: string): void {
        this._bookmarkService.removeBookmark(id);
        this.bookmarks = this._bookmarkService.getBookmarks();
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