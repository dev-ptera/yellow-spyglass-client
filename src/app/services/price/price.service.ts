import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { PriceDataDto } from '@app/types/dto';

@Injectable({
    providedIn: 'root',
})
export class PriceService {
    priceData: PriceDataDto;

    constructor(private readonly _api: ApiService) {
        this.refreshPriceData();
        setInterval(() => {
            this.refreshPriceData();
        }, 60000 * 5);
    }

    refreshPriceData(): void {
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
