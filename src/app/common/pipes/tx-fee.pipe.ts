import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appTxFee' })
export class TxFeePipe implements PipeTransform {
    transform(amount: any): number {
        return Number(amount) * 0.000019;
    }
}
