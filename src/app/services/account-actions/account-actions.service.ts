import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {QrDialogComponent} from "@app/common/components/qr-dialog/qr-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ApiService} from "@app/services/api/api.service";
import {BookmarksService} from "@app/services/bookmarks/bookmarks.service";

@Injectable({
    providedIn: 'root',
})
/** This service is dedicated towards handling user interactions with an Account or Block page.  */
export class AccountActionsService {
    constructor(public dialog: MatDialog,
                private readonly _apiService: ApiService,
                private readonly _snackBar: MatSnackBar,
                private readonly _bookmarkService: BookmarksService,) {

    }

    /** Opens a given address as a QR code in a dialog window. */
    openAccountQRCode(address: string): void {
        this.dialog.open(QrDialogComponent, {
            data: {
                address
            },
        });
    }

    /** Copies a given address or hash to the clipboard. */
    copyDataToClipboard(data: string): void {
        const el = document.createElement('textarea');
        el.value = data ;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this._snackBar.open(el.value.startsWith('ban_') ? 'Copied Address' : 'Copied Hash', undefined, {
            duration: 1000,
        });
    }

    /** Downloads a given account's history to a local CSV file. */
    async downloadTxHistory(address: string): Promise<void> {
        try {
            await this._apiService.downloadAccountTransactions(address);
        } catch (err) {
            console.error(err);
            this._snackBar.open('Error downloading transaction history.', 'Close', { duration: 20000 });
        }
    }


    /** Adds or removes a given address or hash from the list of bookmarks. */
    toggleBookmark(data: string): boolean {
        const isBookmarked = this._bookmarkService.hasBookmark(data);

        if (isBookmarked) {
            this._bookmarkService.removeBookmark(data);
        } else {
            this._bookmarkService.addBookmark({
                id: data,
                alias: data
            });
        }

        const isCurrentlyBookmarked = !isBookmarked;
        this._snackBar.open(isCurrentlyBookmarked ? 'Added Bookmark' : 'Removed Bookmark', undefined, {
            panelClass: 'mat-subheader2',
            duration: 1250,
        });

        return isCurrentlyBookmarked;
    }
}
