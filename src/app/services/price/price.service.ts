import { Injectable } from '@angular/core';
import {ApiService} from "@app/services/api/api.service";
import {PriceData} from "@app/types/dto";

@Injectable({
    providedIn: 'root',
})
export class PriceService {

    priceData: PriceData;

    constructor(private readonly _api: ApiService) {
        this.refreshPriceData();
        setInterval(() => {
            this.refreshPriceData();
        }, 60000 * 5);
    }

    refreshPriceData(): void {
        this._api.getPriceInfo().then((data: PriceData) => {
            this.priceData = data;
        }).catch((err) => {
            console.error(err);
        });
    }

    priceInBitcoin(ban: number): number {
        if (this.priceData) {
            return this.priceInUSD(ban) / this.priceData.bitcoinPriceUsd;
        }
            return 0;
    }

    priceInUSD(ban: number): number {
        if (this.priceData) {
            return this.priceData.bananoPriceUsd * ban;
        }
            return 0;
    }
}
