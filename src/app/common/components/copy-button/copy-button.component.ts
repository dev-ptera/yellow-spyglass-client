import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BookmarksService } from '@app/services/bookmarks/bookmarks.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-copy-button',
    styleUrls: ['address-button.scss'],
    template: `
        <button mat-icon-button class="address-action-button" responsive (click)="copyToClipboard()">
            <mat-icon>content_copy</mat-icon>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class CopyButtonComponent {
    @Input() data: string;

    constructor(private readonly _snackBar: MatSnackBar) {}

    copyToClipboard(): void {
        const el = document.createElement('textarea');
        el.value = this.data;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this._snackBar.open(el.value.startsWith('ban_') ? 'Copied Address' : 'Copied Hash', undefined, {
            duration: 1000,
        });
    }
}
