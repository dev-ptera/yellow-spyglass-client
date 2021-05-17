import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AccountOverview, ConfirmedTransaction } from '../../types';
import { Delegator } from '../../types/dto/Delegator';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.api;

    constructor(private readonly _http: HttpClient) {}

    accountOverview(address: string): Promise<AccountOverview> {
        return this._http.get<AccountOverview>(`${this.url}/account-overview?address=${address}`).toPromise();
    }

    confirmedTransactions(address: string, offset: number): Promise<ConfirmedTransaction[]> {
        return this._http
            .get<ConfirmedTransaction[]>(`${this.url}/confirmed-transactions?address=${address}&offset=${offset}`)
            .toPromise();
    }

    monkey(address: string): Promise<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(`https://monkey.banano.cc/api/v1/monkey/${address}`, { headers, responseType: 'text' })
            .toPromise<string>();
    }
}
