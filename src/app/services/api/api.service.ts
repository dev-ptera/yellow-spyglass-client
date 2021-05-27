import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {AccountOverviewDto, ConfirmedTransactionDto, RepresentativesResponseDto} from '@app/types/dto';
import { Block } from '@app/types/dto/Block';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.api;

    constructor(private readonly _http: HttpClient) {}

    accountOverview(address: string): Promise<AccountOverviewDto> {
        return this._http.get<AccountOverviewDto>(`${this.url}/account-overview/${address}`).toPromise();
    }

    confirmedTransactions(address: string, offset: number): Promise<ConfirmedTransactionDto[]> {
        return this._http
            .get<ConfirmedTransactionDto[]>(`${this.url}/confirmed-transactions?address=${address}&offset=${offset}`)
            .toPromise();
    }

    block(hash: string): Promise<Block> {
        return this._http.get<Block>(`${this.url}/block/${hash}`).toPromise();
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
}
