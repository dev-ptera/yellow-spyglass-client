import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AccountActionsService } from '@app/services/account-actions/account-actions.service';

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

    constructor(private readonly _accountActionsService: AccountActionsService) {}

    copyToClipboard(): void {
        this._accountActionsService.copyDataToClipboard(this.data);
    }
}
