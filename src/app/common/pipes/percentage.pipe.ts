import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appPercent' })
export class PercentagePipe implements PipeTransform {
    transform(value: number): string {
        return this.formatPercentage(value * 100, 1);
    }

    formatPercentage(num: number, decimals: number): string {
        return `${Number(parseFloat(String(num)).toFixed(decimals))}%`;
    }
}
