import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appLittleDecimal' })
export class LittleDecimalPipe implements PipeTransform {
    transform(value: number): string {
        const before = String(value).split('.')[0];
        const after = String(value).split('.')[1];

        console.log(value);

        let results = '';
        results = `<span class="before-decimal">${before}</span>`;

        if (after) {
            return `${results}.<span class="after-decimal">${after}</span>`;
        }
        return results;
    }
}
