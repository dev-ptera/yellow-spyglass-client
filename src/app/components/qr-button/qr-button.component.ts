import { Component, Input, ViewEncapsulation } from '@angular/core';
import { QrDialogComponent } from '@app/components/qr-dialog/qr-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-qr-button',
    styleUrls: ['../copy-button/address-button.scss'],
    template: `
        <button mat-icon-button class="address-action-button" responsive (click)="openDialog()">
            <mat-icon>qr_code_scanner</mat-icon>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class QrButtonComponent {
    @Input() address: string;

    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(QrDialogComponent, {
            data: {
                address: this.address,
            },
        });
    }
}
