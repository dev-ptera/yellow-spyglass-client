import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'delete-bookmark-dialog',
    template: `
        <div [style.maxWidth.px]="vp.sm ? 250 : 350">
            <h2 mat-dialog-title>Remove bookmark?</h2>
            <mat-dialog-content class="mat-typography">
                <div class="mat-subheading-2" style="word-break: break-all; margin-bottom: 24px">{{ data.alias }}</div>
                <div style="display: flex; justify-content: flex-end;">
                    <button mat-flat-button color="primary" style="margin-right: 24px" [mat-dialog-close]="true">
                        Yes
                    </button>
                    <button mat-stroked-button color="primary" [mat-dialog-close]="false">No</button>
                </div>
            </mat-dialog-content>
        </div>
    `,
})
export class DeleteBookmarkDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { alias: string }, public vp: ViewportService) {}
}
