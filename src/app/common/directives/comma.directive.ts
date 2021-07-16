import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appComma' })
export class CommaPipe implements PipeTransform {
    transform(value: number): string {
        return this.numberWithCommas(value);
    }

    numberWithCommas(x: number): string {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}
