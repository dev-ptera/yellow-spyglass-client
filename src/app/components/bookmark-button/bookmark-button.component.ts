import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { BookmarksService } from '@app/services/bookmarks/bookmarks.service';

@Component({
    selector: 'app-bookmark-button',
    styleUrls: ['../copy-button/address-button.scss'],
    template: `
        <button mat-icon-button (click)="toggleBookmark()" class="address-action-button" responsive>
            <mat-icon *ngIf="isBookmarked">favorite</mat-icon>
            <mat-icon *ngIf="!isBookmarked">favorite_border</mat-icon>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class BookmarkButtonComponent implements OnChanges {
    @Input() id: string;
    isBookmarked: boolean;

    constructor(private readonly _bookmarkService: BookmarksService) {}

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
    }
}
