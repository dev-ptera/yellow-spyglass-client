import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
    AccountBalanceDto,
    AccountDistributionStatsDto,
    AccountOverviewDto,
    AliasDto,
    BlockDto,
    ConfirmedTransactionDto,
    KnownAccountDto,
    MonitoredRepDto,
    NetworkStatsDto,
    PriceDataDto,
    RepresentativesResponseDto,
} from '@app/types/dto';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { timeout } from 'rxjs/operators';

const SLOW_MS = 30000;
const MED_MS = 20000;
const FAST_MS = 15000;

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    url = environment.api;
    spyglassApi = environment.spyglassApi;

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

    /** Fetches monKey avatar for a given account. */
    fetchMonKey(address: string): Promise<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(`https://monkey.banano.cc/api/v1/monkey/${address}`, { headers, responseType: 'text' })
            .pipe(timeout(FAST_MS))
            .toPromise<string>();
    }

    representatives(): Promise<RepresentativesResponseDto> {
        return this._http
            .get<RepresentativesResponseDto>(`${this.url}/v2/representatives`)
            .pipe(timeout(MED_MS))
            .toPromise();
    }

    /** Fetches distribute buckets; how many accounts own (1-10 ban, 10-100, etc). */
    fetchDistributionStats(): Promise<AccountDistributionStatsDto> {
        return this._http
            .get<AccountDistributionStatsDto>(`${this.spyglassApi}/v1/distribution/buckets`)
            .pipe(timeout(MED_MS))
            .toPromise();
    }

    /** Fetches list of accounts with their respective balance & representative. */
    fetchRichListSegment(offset: number, size: number): Promise<AccountBalanceDto[]> {
        return this._http
            .post<AccountBalanceDto[]>(
                `${this.spyglassApi}/v1/distribution/rich-list`,
                { offset, size, includeRepresentative: true }
            )
            .pipe(timeout(SLOW_MS))
            .toPromise();
    }

    /** Fetches banano price data. */
    fetchPriceInfo(): Promise<PriceDataDto> {
        return this._http.get<PriceDataDto>(`${this.spyglassApi}/v1/price`).pipe(timeout(FAST_MS)).toPromise();
    }

    getInsights(address: string): Promise<InsightsDto> {
        return this._http.get<InsightsDto>(`${this.url}/insights/${address}`).pipe(timeout(SLOW_MS)).toPromise();
    }

    /** Fetches list of representatives that are considered online. */
    fetchOnlineRepresentatives(): Promise<string[]> {
        return this._http.get<string[]>(`${this.spyglassApi}/v1/representatives/online`).pipe(timeout(FAST_MS)).toPromise();
    }

    /** Fetches list of aliases. */
    fetchAliases(): Promise<AliasDto[]> {
        return this._http.post<AliasDto[]>(
            `${this.spyglassApi}/v1/known/accounts`,
            { includeOwner: false, includeType: false }
        ).pipe(timeout(FAST_MS)).toPromise();
    }

    /** Fetches list of addresses with known aliases, owner, & type. */
    fetchKnownAccounts(): Promise<KnownAccountDto[]> {
        return this._http.post<KnownAccountDto[]>(
            `${this.url}/known-accounts`,
            { includeOwner: true, includeType: true }
        ).pipe(timeout(FAST_MS)).toPromise();
    }

    megaphone(hasOfflineRep: string[], hasLargeRep: string[]): Promise<void> {
        return this._http
            .post<void>(`${this.url}/megaphone`, {
                hasOfflineRep,
                hasLargeRep,
            })
            .toPromise();
    }

    getNetworkStats(): Promise<NetworkStatsDto> {
        return this._http.get<NetworkStatsDto>(`${this.url}/network-stats`).pipe(timeout(FAST_MS)).toPromise();
    }
}
