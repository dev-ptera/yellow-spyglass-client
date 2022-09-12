import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import { AccountActionsService } from '@app/services/account-actions/account-actions.service';

@Component({
    selector: 'app-tx-view-button',
    encapsulation: ViewEncapsulation.None,
    template: `
        <button
            responsive
            mat-icon-button
            class="address-action-button"
            [matTooltip]="isCompact ? 'Show Relaxed View' : 'Show Condensed View'"
            (click)="isCompact = !isCompact; isCompactChange.emit(isCompact)"
        >
            <mat-icon>{{ isCompact ? 'unfold_more' : 'unfold_less'}}</mat-icon>
        </button>
    `,
})
export class ViewButtonComponent {

    @Input() isCompact: boolean;
    @Output() isCompactChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private readonly _accountActionsService: AccountActionsService) {}

}
