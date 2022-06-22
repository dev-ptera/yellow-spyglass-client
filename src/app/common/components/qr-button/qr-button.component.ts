import { Component, Input, ViewEncapsulation } from '@angular/core';
import {AccountActionsService} from "@app/services/account-actions/account-actions.service";

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

    constructor(private readonly _accountActionsService: AccountActionsService) {}

    openDialog(): void {
        this._accountActionsService.openAccountQRCode(this.address);
    }
}
