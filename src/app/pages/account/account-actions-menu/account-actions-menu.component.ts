import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AccountActionsService } from '@app/services/account-actions/account-actions.service';
import { BookmarksService } from '@app/services/bookmarks/bookmarks.service';

@Component({
    selector: 'app-account-actions-menu',
    template: `
        <blui-user-menu [(open)]="accountActionsMenuOpen">
            <mat-icon blui-avatar>more_vert</mat-icon>
            <mat-nav-list blui-menu-body [style.paddingTop.px]="0">
                <blui-info-list-item
                    [dense]="true"
                    (click)="accountActionsService.copyDataToClipboard(data); accountActionsMenuOpen = false"
                >
                    <mat-icon blui-icon>content_copy</mat-icon>
                    <div blui-title>Copy Address</div>
                </blui-info-list-item>
                <blui-info-list-item
                    [dense]="true"
                    (click)="isBookmarked = accountActionsService.toggleBookmark(data); accountActionsMenuOpen = false"
                >
                    <mat-icon blui-icon *ngIf="isBookmarked" color="warn">favorite</mat-icon>
                    <mat-icon blui-icon *ngIf="!isBookmarked">favorite_border</mat-icon>
                    <div blui-title>Bookmark Address</div>
                </blui-info-list-item>
                <blui-info-list-item
                    [dense]="true"
                    (click)="accountActionsService.openAccountQRCode(data); accountActionsMenuOpen = false"
                >
                    <mat-icon blui-icon>qr_code_scanner</mat-icon>
                    <div blui-title>Scan Address</div>
                </blui-info-list-item>
                <blui-info-list-item
                    *ngIf="showCSVExportActionButton"
                    [dense]="true"
                    (click)="downloadHistory(); accountActionsMenuOpen = false"
                >
                    <mat-icon blui-icon>download</mat-icon>
                    <div blui-title>Download History</div>
                </blui-info-list-item>
                <blui-info-list-item
                    *ngIf="showFilterActionButton"
                    [dense]="true"
                    (click)="
                        showFilter = !showFilter; showFilterChange.emit(showFilter); accountActionsMenuOpen = false
                    "
                >
                    <mat-icon blui-icon>tune</mat-icon>
                    <div blui-title>Show Filters</div>
                </blui-info-list-item>
            </mat-nav-list>
        </blui-user-menu>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class AccountActionsMenuComponent {
    @Input() data: string;
    @Input() showCSVExportActionButton: boolean;
    @Input() showFilterActionButton: boolean;
    @Input() showFilter: boolean;
    @Output() showFilterChange = new EventEmitter<boolean>();

    isBookmarked: boolean;
    isDownloadingHistory: boolean;
    accountActionsMenuOpen = false;

    constructor(
        private readonly _bookmarkService: BookmarksService,
        public accountActionsService: AccountActionsService
    ) {}

    ngOnChanges(): void {
        this.checkIsBookmarked();
    }

    checkIsBookmarked(): void {
        this.isBookmarked = this._bookmarkService.hasBookmark(this.data);
    }

    downloadHistory(): void {
        if (this.isDownloadingHistory) {
            return;
        }
        this.isDownloadingHistory = true;
        void this.accountActionsService.downloadTxHistory(this.data).finally(() => {
            this.isDownloadingHistory = false;
        });
    }
}
