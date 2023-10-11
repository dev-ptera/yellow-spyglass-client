import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'delete-bookmark-dialog',
    template: `
        <ng-container *transloco="let t; scope: 'bookmarks'; read: 'bookmarks'">
            <div [style.maxWidth.px]="vp.sm ? 250 : 350">
                <h2 mat-dialog-title>{{ t('removeBookmark') }}</h2>
                <mat-dialog-content class="mat-typography">
                    <div style="font-size: 16px; word-break: break-all; margin-bottom: 24px">{{ data.alias }}</div>
                    <div style="display: flex; justify-content: flex-end;">
                        <button mat-flat-button color="primary" style="margin-right: 24px" [mat-dialog-close]="true">
                            {{ t('yes') }}
                        </button>
                        <button mat-stroked-button color="primary" [mat-dialog-close]="false">{{ t('no') }}</button>
                    </div>
                </mat-dialog-content>
            </div>
        </ng-container>
    `,
})
export class DeleteBookmarkDialog {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { alias: string },
        public vp: ViewportService
    ) {}
}
