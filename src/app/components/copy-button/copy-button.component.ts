import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-copy-button',
    template: `
        <button mat-icon-button (click)="copyToClipboard()">
            <mat-icon>content_copy</mat-icon>
        </button>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class CopyButtonComponent {
    @Input() data: string;

    copyToClipboard(): void {
        const el = document.createElement('textarea');
        el.value = this.data;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
}
