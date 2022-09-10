import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AccountActionsService } from '@app/services/account-actions/account-actions.service';

@Component({
    selector: 'app-csv-button',
    encapsulation: ViewEncapsulation.None,
    template: `
        <button
            mat-icon-button
            class="address-action-button"
            [disabled]="isLoading"
            responsive
            matTooltip="Download Transaction History"
            (click)="downloadTxHistory()"
        >
            <mat-icon>download</mat-icon>
        </button>
    `,
})
export class CsvButtonComponent {
    @Input() address: string;

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
