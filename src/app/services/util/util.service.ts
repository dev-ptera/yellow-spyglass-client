import { Injectable } from '@angular/core';
import { rawToBan } from 'banano-unit-converter';
import { Subtype } from '@dev-ptera/nano-node-rpc';

@Injectable({
    providedIn: 'root',
})
export class UtilService {
    // TODO, I have a pipe for this already; why is this here?
    numberWithCommas(x: number | string): string {
        if (!x && x !== 0) {
            return '';
        }
        const parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    convertRawToBan(
        raw: string,
        params: {
            precision: number;
            comma?: boolean;
            state?: Subtype;
        }
    ): string {
        if (!raw || raw === '0') {
            return '0';
        }
        let ban = Number(rawToBan(raw))
            .toFixed(params.precision)
            .replace(/\.?0+$/, '');
        if (params.comma) {
            ban = this.numberWithCommas(ban);
        }
        if (params.state === 'receive') {
            return `+${ban}`;
        }
        if (params.state === 'send') {
            return `-${ban}`;
        }
        return ban;
    }

    shortenAddress(addr: string): string {
        return `${addr.substr(0, 12)}...${addr.substr(addr.length - 6, addr.length)}`;
    }

    isValidBNSDomain(bns: string): boolean {
        const parts = bns.split('.');
        //later, can also check for illegal characters once that is more settled
        return parts.length === 2 && parts[0].length <= 32;
    }
}
