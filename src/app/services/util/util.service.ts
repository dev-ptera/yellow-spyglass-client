import { Injectable } from '@angular/core';
import { rawToBan } from 'banano-unit-converter';
import { Subtype } from '@dev-ptera/nano-node-rpc';

@Injectable({
    providedIn: 'root',
})
export class UtilService {
    numberWithCommas(x: number | string): string {
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

    formatHtmlAddress(addr: string): string {
        const ban = addr.substring(0, 4);
        const first7 = addr.substring(4, 12);
        const middle = addr.substring(12, addr.length - 7);
        const last6 = addr.substring(addr.length - 7, addr.length);
        return `${ban}<strong>${first7}</strong>${middle}${last6}`;
    }
}
