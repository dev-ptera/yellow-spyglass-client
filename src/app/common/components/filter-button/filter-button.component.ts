import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-filter-button',
    styleUrls: ['../copy-button/address-button.scss'],
    template: `
        <button
            mat-icon-button
            class="address-action-button"
            responsive
            (click)="showFilter = !showFilter; showFilterChange.emit(showFilter)"
        >
            <mat-icon>tune</mat-icon>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class FilterButtonComponent {
    @Input() showFilter: boolean;
    @Output() showFilterChange = new EventEmitter<boolean>();
}
