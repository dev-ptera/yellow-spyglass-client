import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-load-spinner',
    encapsulation: ViewEncapsulation.None,
    template: ` <mat-spinner diameter="24" style="margin-left: 16px"></mat-spinner> `,
})
export class LoadSpinnerComponent {}
