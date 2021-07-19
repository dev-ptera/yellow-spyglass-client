import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
    AccountBalanceDto,
    AccountDistributionStatsDto,
    AccountOverviewDto,
    BlockDto,
    ConfirmedTransactionDto,
    KnownAccountDto,
    MonitoredRepDto,
    PriceDataDto,
    RepresentativesResponseDto,
} from '@app/types/dto';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { timeout } from 'rxjs/operators';

const SLOW_MS = 20000;
const MED_MS = 15000;
const FAST_MS = 10000;

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.api;
    richListUrl = environment.richListApi;

    constructor(private readonly _http: HttpClient) {}

    accountOverview(address: string): Promise<AccountOverviewDto> {
        return this._http
            .get<AccountOverviewDto>(`${this.url}/account-overview/${address}`)
            .pipe(timeout(SLOW_MS))
            .toPromise();
    }

    confirmedTransactions(address: string, offset: number, pageSize: number): Promise<ConfirmedTransactionDto[]> {
        return this._http
            .get<ConfirmedTransactionDto[]>(
                `${this.url}/confirmed-transactions?address=${address}&offset=${offset}&size=${pageSize}`
            )
            .pipe(timeout(MED_MS))
            .toPromise();
    }

    block(hash: string): Promise<BlockDto> {
        return this._http.get<BlockDto>(`${this.url}/block/${hash}`).pipe(timeout(FAST_MS)).toPromise();
    }

    node(): Promise<MonitoredRepDto> {
        return this._http.get<MonitoredRepDto>(`${this.url}/node`).pipe(timeout(FAST_MS)).toPromise();
    }

    monkey(address: string): Promise<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(`https://monkey.banano.cc/api/v1/monkey/${address}`, { headers, responseType: 'text' })
            .pipe(timeout(FAST_MS))
            .toPromise<string>();
    }

    representatives(): Promise<RepresentativesResponseDto> {
        return this._http
            .get<RepresentativesResponseDto>(`${this.url}/representatives`)
            .pipe(timeout(MED_MS))
            .toPromise();
    }

    /* Rich List is too expensive operation to run non-locally; default to production. */
    bananoDistribution(): Promise<AccountDistributionStatsDto> {
        return this._http
            .get<AccountDistributionStatsDto>(`${this.richListUrl}/accounts-distribution`)
            .pipe(timeout(MED_MS))
            .toPromise();
    }

    getAccountBalances(offset: number, pageSize: number): Promise<AccountBalanceDto[]> {
        return this._http
            .get<AccountBalanceDto[]>(`${this.richListUrl}/accounts-balance?offset=${offset}&size=${pageSize}`)
            .pipe(timeout(3000))
            .toPromise();
    }

    getPriceInfo(): Promise<PriceDataDto> {
        return this._http.get<PriceDataDto>(`${this.url}/price`).pipe(timeout(FAST_MS)).toPromise();
    }

    getInsights(address: string): Promise<InsightsDto> {
        return this._http.get<InsightsDto>(`${this.url}/insights/${address}`).pipe(timeout(SLOW_MS)).toPromise();
    }

    getOnlineReps(): Promise<string[]> {
        return this._http.get<string[]>(`${this.url}/online-reps`).pipe(timeout(FAST_MS)).toPromise();
    }

    getKnownAccounts(): Promise<KnownAccountDto[]> {
        return this._http.get<KnownAccountDto[]>(`${this.url}/known-accounts`).pipe(timeout(FAST_MS)).toPromise();
    }

    megaphone(hasOfflineRep: string[], hasLargeRep: string[]): Promise<void> {
        return this._http.post<void>(`${this.url}/megaphone`, {
            hasOfflineRep,
            hasLargeRep
        }).toPromise();
    }
}
