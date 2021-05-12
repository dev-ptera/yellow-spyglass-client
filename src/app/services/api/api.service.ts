import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.api;

    constructor(private readonly _http: HttpClient) {}

    testApi(): Promise<any> {
        return this._http.get<any>(`${this.url}/account?address=ban_3boost5r4bosii4c3ad6yubf5npmkgm5rb7kecyzmnu337p9bta8kgikb1a4&offset=0`).toPromise();
    }
}
