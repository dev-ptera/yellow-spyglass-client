import { DomSanitizer } from '@angular/platform-browser';
import { Pipe } from '@angular/core';

@Pipe({ name: 'safe' })
export class SafeHtmlPipe {
    constructor(private sanitizer: DomSanitizer) {}

    transform(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
