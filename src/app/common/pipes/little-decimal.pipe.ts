import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appLittleDecimal' })
export class LittleDecimalPipe implements PipeTransform {
    transform(value: number): string {
        const before = String(value).split('.')[0];
        const after = String(value).split('.')[1];
        return `<span class="before-decimal">${before}</span>${after === '0' ? '' : '.'}<span class="after-decimal">${after}</span>`

    }
}
