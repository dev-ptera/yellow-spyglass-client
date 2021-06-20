import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-error',
    template: `
        <pxb-empty-state responsive style="padding: 72px 48px" [title]="title" [description]="description">
            <mat-icon pxb-empty-icon>error</mat-icon>
        </pxb-empty-state>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class ErrorComponent {
    @Input() title = 'Error';
    @Input() description = 'An error has occurred. If this persists, please contact dev.ptera@gmail.com.';
}
