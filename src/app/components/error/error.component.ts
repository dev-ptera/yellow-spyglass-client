import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-error',
    template: `
        <pxb-empty-state
            responsive
            style="padding: 72px 48px"
            title="No Insights"
            description="An error has occurred. If this persists, please contact dev.ptera@gmail.com."
        >
            <mat-icon pxb-empty-icon>error</mat-icon>
        </pxb-empty-state>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class ErrorComponent {}
