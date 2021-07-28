import { Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { BookmarksService } from '@app/services/bookmarks/bookmarks.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-bookmark-button',
    styleUrls: ['../copy-button/address-button.scss'],
    template: `
        <button mat-icon-button class="address-action-button" (click)="toggleBookmark()" responsive>
            <mat-icon *ngIf="isBookmarked" class="bookmarked-button">favorite</mat-icon>
            <mat-icon *ngIf="!isBookmarked">favorite_border</mat-icon>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class BookmarkButtonComponent implements OnChanges {
    @Input() id: string;
    isBookmarked: boolean;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    constructor(private readonly _bookmarkService: BookmarksService, private readonly _snackBar: MatSnackBar) {}

    ngOnChanges(): void {
        this.checkIsBookmarked();
    }

    checkIsBookmarked(): void {
        this.isBookmarked = this._bookmarkService.hasBookmark(this.id);
    }

    toggleBookmark(): void {
        if (this.isBookmarked) {
            this._bookmarkService.removeBookmark(this.id);
        } else {
            this._bookmarkService.addBookmark({
                id: this.id,
                alias: this.id,
            });
        }
        this.isBookmarked = !this.isBookmarked;
        this._snackBar.open(this.isBookmarked ? 'Added Bookmark' : 'Removed Bookmark', undefined, {
            panelClass: 'mat-subheader2',
            duration: 1250,
        });
    }
}
