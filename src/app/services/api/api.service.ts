import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
    AccountBalanceDto,
    AccountDistributionStatsDto,
    AccountOverviewDto,
    BlockDto,
    ConfirmedTransactionDto,
    MonitoredRepDto,
    PriceDataDto,
    RepresentativesResponseDto,
} from '@app/types/dto';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.api;

    constructor(private readonly _http: HttpClient) {}

    accountOverview(address: string): Promise<AccountOverviewDto> {
        return this._http.get<AccountOverviewDto>(`${this.url}/account-overview/${address}`).toPromise();
    }

    confirmedTransactions(address: string, offset: number, pageSize: number): Promise<ConfirmedTransactionDto[]> {
        return this._http
            .get<ConfirmedTransactionDto[]>(
                `${this.url}/confirmed-transactions?address=${address}&offset=${offset}&size=${pageSize}`
            )
            .toPromise();
    }

    block(hash: string): Promise<BlockDto> {
        return this._http.get<BlockDto>(`${this.url}/block/${hash}`).toPromise();
    }

    node(): Promise<MonitoredRepDto> {
        return this._http.get<MonitoredRepDto>(`${this.url}/node`).toPromise();
    }

    monkey(address: string): Promise<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(`https://monkey.banano.cc/api/v1/monkey/${address}`, { headers, responseType: 'text' })
            .toPromise<string>();
    }

    representatives(): Promise<RepresentativesResponseDto> {
        return this._http.get<RepresentativesResponseDto>(`${this.url}/representatives`).toPromise();
    }

    bananoDistribution(): Promise<AccountDistributionStatsDto> {
        return this._http.get<AccountDistributionStatsDto>(`${this.url}/accounts-distribution`).toPromise();
    }

    getAccountBalances(offset: number, pageSize: number): Promise<AccountBalanceDto[]> {
        return this._http
            .get<AccountBalanceDto[]>(`${this.url}/accounts-balance?offset=${offset}&size=${pageSize}`)
            .toPromise();
    }

    getPriceInfo(): Promise<PriceDataDto> {
        return this._http.get<PriceDataDto>(`${this.url}/price`).toPromise();
    }
}
