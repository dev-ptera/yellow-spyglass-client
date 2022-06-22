import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AccountActionsService } from '@app/services/account-actions/account-actions.service';

@Component({
    selector: 'app-csv-button',
    styleUrls: ['../copy-button/address-button.scss'],
    template: `
        <button
            *ngIf="blockCount <= maxTransactionsLimit"
            mat-icon-button
            class="address-action-button"
            responsive
            (click)="downloadTxHistory()"
        >
            <mat-icon>download</mat-icon>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class CsvButtonComponent {
    @Input() address: string;
    @Input() maxTransactionsLimit: number;
    @Input() blockCount: number;

    isLoading: boolean;

    constructor(private readonly _accountActionsService: AccountActionsService) {}

    downloadTxHistory(): void {
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        this._accountActionsService.downloadTxHistory(this.address).finally(() => {
            this.isLoading = false;
        });
    }
}
