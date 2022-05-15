import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { PriceDataDto } from '@app/types/dto';

@Injectable({
    providedIn: 'root',
})
/** Fetches price data & refreshes every 5 minutes. */
export class PriceService {
    priceData: PriceDataDto;

    constructor(private readonly _api: ApiService) {
        this._refreshPriceData();
        setInterval(() => {
            this._refreshPriceData();
        }, 60000 * 5);
    }

    private _refreshPriceData(): void {
        this._api
            .fetchPriceInfo()
            .then((data: PriceDataDto) => {
                this.priceData = data;
            })
            .catch((err) => {
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
