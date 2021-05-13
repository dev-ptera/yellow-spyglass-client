import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.api;

    constructor(private readonly _http: HttpClient) {}

    testApi(): Promise<any> {
        return this._http
            .get<any>(
                `${this.url}/account?address=ban_3boost5r4bosii4c3ad6yubf5npmkgm5rb7kecyzmnu337p9bta8kgikb1a4&offset=0`
            )
            .toPromise();
    }

    account(address: string): Promise<any> {
        return this._http
            .get<any>(
                `${this.url}/account?address=${address}&offset=0`
            )
            .toPromise();
    }

    monkey(address: string): Promise<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(
                `https://monkey.banano.cc/api/v1/monkey/ban_1ka1ium4pfue3uxtntqsrib8mumxgazsjf58gidh1xeo5te3whsq8z476goo`,
                { headers, responseType: 'text'}

            )
            .toPromise<string>();
    }
}
