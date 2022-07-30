import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { saveAs } from 'file-saver';

import {
    AccountBalanceDto,
    AccountDistributionStatsDto,
    AccountNFTDto,
    AccountOverviewDto,
    AliasDto,
    BlockDto,
    ConfirmedTransactionDto,
    DelegatorsOverviewDto,
    ExplorerSummaryDto,
    HostNodeStatsDto,
    KnownAccountDto,
    MonitoredRepDto,
    NakamotoCoefficientDto,
    PeerVersionsDto,
    PriceDataDto,
    QuorumDto,
    ReceivableTransactionDto,
    RepresentativeDto,
    RepScoreDto,
    SocialMediaAccountAliasDto,
    SupplyDto,
} from '@app/types/dto';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import { Observable, Subject } from 'rxjs';
import { FilterDialogData } from '@app/pages/account/tabs/transactions/transactions.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    httpApi: string;
    wsApi: string;
    apiToUseSubject = new Subject<string>();
    accountLoadedSubject = new Subject<AccountOverviewDto>();

    constructor(private readonly _http: HttpClient) {
        this._pingServers();
    }

    /** On app load, pings 2 separate APIs to see which one is faster.  Use that one for this session. */
    private _pingServers(): void {
        const api1 = environment.api1;
        const api2 = environment.api2;
        const req1 = new Promise((resolve) => {
            // TODO: Replace this with an actual PING endpoint.  Make this as fast as possible.
            this._http
                .get<any>(`${api1}/v1/representatives/online`)
                .toPromise()
                .then(() => resolve(api1))
                .catch((err) => {
                    console.error(err);
                    resolve(api2); // If error, resolve the opposite api.
                });
        });
        /*
        const req2 = new Promise((resolve) => {
            this._http
                .get<any>(`${api2}/v1/representatives/online`)
                .toPromise()
                .then(() => resolve(api2))
                .catch((err) => {
                    console.error(err);
                    resolve(api1);
                });
        });
         */

        // REQ 2 not included for now; api.creeper is not returning correct timestmaps.
        Promise.race([req1])
            .then((faster: string) => {
                this.apiToUseSubject.next(faster);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /** Resolves after the API to use has been set. */
    private _hasPingedApi(): Promise<void> {
        return new Promise((resolve) => {
            if (this.httpApi) {
                resolve();
            } else {
                this.apiToUseSubject.subscribe((fastestApi) => {
                    this.httpApi = fastestApi;
                    this.wsApi = fastestApi.replace('http', 'ws').replace('https', 'wss');
                    resolve();
                });
            }
        });
    }

    /** Given an address, returns a monKey API URL. */
    createMonKeyUrl(address: string): string {
        return `https://monkey.banano.cc/api/v1/monkey/${address}`;
    }

    /** Fetches explorer summary information. */
    async fetchExplorerSummaryData(): Promise<ExplorerSummaryDto> {
        await this._hasPingedApi();
        return this._http.get<ExplorerSummaryDto>(`${this.httpApi}/v1/explorer-summary`).toPromise();
    }

    /** Fetches account summary information. Emits an event when loaded. */
    async fetchAccountOverview(address: string): Promise<void> {
        await this._hasPingedApi();
        try {
            const overview = await this._http.get<AccountOverviewDto>(`${this.httpApi}/v1/account/overview/${address}`).toPromise();
            this.accountLoadedSubject.next(overview);
        } catch (err) {
            console.error(err);
        }
    }

    /** Fetches NFTs that an account owns. */
    async fetchAccountNFTs(address: string): Promise<AccountNFTDto[]> {
        await this._hasPingedApi();
        return this._http.get<AccountNFTDto[]>(`${this.httpApi}/v1/account/nfts/${address}`).toPromise();
    }

    /** Fetches confirmed transactions that meets filtered criteria. */
    async fetchConfirmedTransactions(
        address: string,
        size: number,
        offset: number,
        filters?: FilterDialogData
    ): Promise<ConfirmedTransactionDto[]> {
        await this._hasPingedApi();
        const url = `${this.httpApi}/v2/account/confirmed-transactions`;
        const filterAddresses =
            filters && filters.filterAddresses ? filters.filterAddresses.split(',').map((x) => x.trim()) : [];
        const excludedAddresses =
            filters && filters.excludedAddresses ? filters.excludedAddresses.split(',').map((x) => x.trim()) : [];
        return this._http
            .post<ConfirmedTransactionDto[]>(url, {
                address,
                size,
                offset,
                ...filters,
                filterAddresses,
                excludedAddresses
            })
            .toPromise();
    }

    /** Fetches account delegators. */
    async fetchAccountDelegators(address: string, offset: number): Promise<DelegatorsOverviewDto> {
        await this._hasPingedApi();
        return this._http
            .post<DelegatorsOverviewDto>(`${this.httpApi}/v1/account/delegators`, { address, size: 50, offset })
            .toPromise();
    }

    /** Fetches 50 receivable transactions for a given address. */
    async fetchReceivableTransactions(address: string): Promise<ReceivableTransactionDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<ReceivableTransactionDto[]>(`${this.httpApi}/v1/account/receivable-transactions`, {
                address,
                size: 50,
            })
            .toPromise();
    }

    /** Fetches historic account statistics. */
    async fetchInsights(address: string): Promise<InsightsDto> {
        await this._hasPingedApi();
        return this._http
            .post<InsightsDto>(`${this.httpApi}/v1/account/insights`, { address, includeHeightBalances: true })
            .toPromise();
    }

    /** Given a hash, fetches block. */
    async fetchBlock(hash: string): Promise<BlockDto> {
        await this._hasPingedApi();
        return this._http.get<BlockDto>(`${this.httpApi}/v1/block/${hash}`).toPromise();
    }

    /** Fetches list of known vanities addresses. */
    async fetchKnownVanities(): Promise<string[]> {
        await this._hasPingedApi();
        return this._http.get<string[]>(`${this.httpApi}/v1/known/vanities`).toPromise();
    }

    /** Fetches server stats & info. */
    async fetchHostNodeStats(): Promise<HostNodeStatsDto> {
        await this._hasPingedApi();
        return this._http.get<HostNodeStatsDto>(`${this.httpApi}/v1/network/node-stats`).toPromise();
    }

    /** Fetches monKey avatar for a given account. */
    async fetchMonKey(address: string): Promise<string> {
        await this._hasPingedApi();
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(`https://monkey.banano.cc/api/v1/monkey/${address}`, { headers, responseType: 'text' })
            .toPromise<string>();
    }

    /** Fetches representatives stats. */
    async fetchLargeRepresentatives(): Promise<RepresentativeDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<RepresentativeDto[]>(`${this.httpApi}/v1/representatives`, {
                minimumWeight: 100_000,
                includeDelegatorCount: true,
            })
            .toPromise();
    }

    /** Fetches monitored representatives stats. */
    async fetchMonitoredRepresentatives(): Promise<MonitoredRepDto[]> {
        await this._hasPingedApi();
        return this._http.get<MonitoredRepDto[]>(`${this.httpApi}/v1/representatives/monitored`).toPromise();
    }

    /** Fetches representatives stats. */
    async fetchRepresentativeScores(): Promise<RepScoreDto[]> {
        await this._hasPingedApi();
        return this._http.get<RepScoreDto[]>(`${this.httpApi}/v1/representatives/scores`).toPromise();
    }

    /** Fetches distribute buckets; how many accounts own (1-10 ban, 10-100, etc). */
    async fetchDistributionStats(): Promise<AccountDistributionStatsDto> {
        await this._hasPingedApi();
        return this._http.get<AccountDistributionStatsDto>(`${this.httpApi}/v1/distribution/buckets`).toPromise();
    }

    /** Fetches quorum details. */
    async fetchQuorumStats(): Promise<QuorumDto> {
        await this._hasPingedApi();
        return this._http.get<QuorumDto>(`${this.httpApi}/v1/network/quorum`).toPromise();
    }

    /** Fetches Supply details. */
    async fetchSupplyStats(): Promise<SupplyDto> {
        await this._hasPingedApi();
        return this._http.get<SupplyDto>(`${this.httpApi}/v1/distribution/supply`).toPromise();
    }

    /** Fetches Peer details. */
    async fetchPeerVersions(): Promise<PeerVersionsDto[]> {
        await this._hasPingedApi();
        return this._http.get<PeerVersionsDto[]>(`${this.httpApi}/v1/network/peers`).toPromise();
    }

    /** Fetches how many bad actors required to compromise network. */
    async fetchNakamotoCoefficient(): Promise<NakamotoCoefficientDto> {
        await this._hasPingedApi();
        return this._http.get<NakamotoCoefficientDto>(`${this.httpApi}/v1/network/nakamoto-coefficient`).toPromise();
    }

    /** Fetches list of accounts with their respective balance & representative. */
    async fetchRichListSegment(offset: number, size: number): Promise<AccountBalanceDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<AccountBalanceDto[]>(`${this.httpApi}/v1/distribution/rich-list`, {
                offset,
                size,
                includeRepresentative: true,
            })
            .toPromise();
    }

    /** Fetches all transaction history for a given account. */
    async downloadAccountTransactions(address: string): Promise<void> {
        await this._hasPingedApi();
        const fileName = `tx-${address}.csv`;
        return this._http
            .post(`${this.httpApi}/v1/account/export`, { address }, { responseType: 'text' })
            .toPromise()
            .then((data) => {
                const blob = new Blob([data], { type: 'application/text' });
                saveAs(blob, fileName);
                return Promise.resolve();
            })
            .catch((err) => {
                const jsonErr = JSON.parse(err.error);
                return Promise.reject(jsonErr);
            });
    }

    /** Fetches banano price data. */
    async fetchPriceInfo(): Promise<PriceDataDto> {
        await this._hasPingedApi();
        return this._http.get<PriceDataDto>(`${this.httpApi}/v1/price`).toPromise();
    }

    /** Fetches list of representatives that are considered online. */
    async fetchOnlineRepresentatives(): Promise<string[]> {
        await this._hasPingedApi();
        return this._http.get<string[]>(`${this.httpApi}/v1/representatives/online`).toPromise();
    }

    /** Fetches list of aliases. */
    async fetchAliases(): Promise<AliasDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<AliasDto[]>(`${this.httpApi}/v1/known/accounts`, { includeOwner: false, includeType: false })
            .toPromise();
    }

    /** Fetches list of addresses with known aliases, owner, & type. */
    async fetchKnownAccounts(): Promise<KnownAccountDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<KnownAccountDto[]>(`${this.httpApi}/v1/known/accounts`, { includeOwner: true, includeType: true })
            .toPromise();
    }

    /** Given a hash, fetches block. */
    async fetchBlockFromAddressHeight(address: string, height: number): Promise<BlockDto> {
        await this._hasPingedApi();
        return this._http.post<BlockDto>(`${this.httpApi}/v1/account/block-at-height`, { address, height }).toPromise();
    }

    /** Fetches an address's discord/twitter/telegram alias, if any. */
    async fetchSocialMediaAccount(address: string): Promise<SocialMediaAccountAliasDto> {
        await this._hasPingedApi();
        return this._http
            .get<SocialMediaAccountAliasDto>(`${this.httpApi}/v1/known/social-media/${address}`)
            .toPromise();
    }

    /** Fetches account insights & provides incremental updates to feed into a progress spinner. */
    async fetchAccountInsightsWS(address: string): Promise<Observable<number | InsightsDto>> {
        await this._hasPingedApi();
        const subject = new Subject<number | InsightsDto>();
        const socket = new WebSocket(`${this.wsApi}/v1/account/insights`);
        socket.onopen = (): void => {
            socket.send(JSON.stringify({ address, includeHeightBalances: true }));
        };
        socket.onmessage = (msg): void => {
            const data = msg.data;
            if (isNaN(Number(data))) {
                subject.next(JSON.parse(data) as InsightsDto);
                socket.close();
            } else {
                subject.next(Number(data));
            }
        };
        return subject;
    }
}
