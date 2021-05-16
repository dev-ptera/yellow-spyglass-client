import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {AccountOverview, ConfirmedTransaction} from '../../types';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.api;

    constructor(private readonly _http: HttpClient) {}

    confirmedTransactions(address: string, offset: number = 0): Promise<ConfirmedTransaction[]> {
        return this._http.get<ConfirmedTransaction[]>(`${this.url}/confirmed-transactions?address=${address}&offset=0`).toPromise();
    }

    accountOverview(address: string): Promise<AccountOverview> {
        return this._http.get<AccountOverview>(`${this.url}/account-overview?address=${address}`).toPromise();
    }

    monkey(address: string): Promise<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(`https://monkey.banano.cc/api/v1/monkey/${address}`, { headers, responseType: 'text' })
            .toPromise<string>();
    }
}
