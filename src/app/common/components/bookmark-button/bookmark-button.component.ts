import { Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { BookmarksService } from '@app/services/bookmarks/bookmarks.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AccountActionsService } from '@app/services/account-actions/account-actions.service';

@Component({
    selector: 'app-bookmark-button',
    encapsulation: ViewEncapsulation.None,
    template: `
        <button
            *ngIf="!isBookmarked"
            mat-icon-button
            class="address-action-button"
            (click)="toggleBookmark()"
            responsive
            matTooltip="Add to Bookmarks"
        >
            <mat-icon class="bookmarked-button">favorite_border</mat-icon>
        </button>

        <button
            *ngIf="isBookmarked"
            mat-icon-button
            class="address-action-button"
            (click)="toggleBookmark()"
            responsive
            color="warn"
            matTooltip="Remove from Bookmarks"
        >
            <mat-icon class="bookmarked-button">favorite</mat-icon>
        </button>
    `,
})
export class BookmarkButtonComponent implements OnChanges {
    @Input() id: string;
    isBookmarked: boolean;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    constructor(
        private readonly _bookmarkService: BookmarksService,
        private readonly _accountActionService: AccountActionsService
    ) {}

    ngOnChanges(): void {
        this.checkIsBookmarked();
    }

    checkIsBookmarked(): void {
        this.isBookmarked = this._bookmarkService.hasBookmark(this.id);
    }

    toggleBookmark(): void {
        this.isBookmarked = this._accountActionService.toggleBookmark(this.id);
    }
}
