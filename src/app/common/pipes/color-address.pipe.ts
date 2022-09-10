import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'colorAddress' })
export class ColorAddressPipe implements PipeTransform {
    transform(address: string): string {
        const firstBits = address.substring(0, 12);
        const midBits = address.substring(12, 58);
        const lastBits = address.substring(58, 64);

        return `<span class="text">${firstBits}</span><span class="text-hint">${midBits}</span><span class="text">${lastBits}</span>`;
    }
}
