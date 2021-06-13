import {AfterViewInit, Component, Inject, ViewEncapsulation} from '@angular/core';

import * as QRCode from 'qrcode';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    selector: 'app-qr-dialog',
    template: `
        <h1 mat-dialog-title>Address</h1>
        <div mat-dialog-content>
            <canvas id="qr-code-dialog" style="display: block"></canvas>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class QrDialogComponent implements AfterViewInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {  address: string }) {}

    ngAfterViewInit(): void {
        const canvas = document.getElementById('qr-code-dialog');
        QRCode.toCanvas(canvas, this.data.address, (error) => {
            if (error) console.error(error);
        });
    }
}
