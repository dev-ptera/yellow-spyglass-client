import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
    AccountBalanceDto,
    AccountDistributionStatsDto, AccountNFTDto,
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
    SupplyDto,
} from '@app/types/dto';
import { InsightsDto } from '@app/types/dto/InsightsDto';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    spyglassApi = environment.spyglassApi;

    createMonKeyUrl(address: string): string {
        return `https://monkey.banano.cc/api/v1/monkey/${address}`;
    }

    constructor(private readonly _http: HttpClient) {}

    /** Fetches explorer summary information. */
    fetchExplorerSummaryData(): Promise<ExplorerSummaryDto> {
        return this._http.get<ExplorerSummaryDto>(`${this.spyglassApi}/v1/explorer-summary`).toPromise();
    }

    /** Fetches account summary information. */
    fetchAccountOverview(address: string): Promise<AccountOverviewDto> {
        return this._http.get<AccountOverviewDto>(`${this.spyglassApi}/v1/account/overview/${address}`).toPromise();
    }

    /** Fetches account summary information. */
    fetchAccountNFTs(address: string): Promise<AccountNFTDto[]> {
        return this._http.get<AccountNFTDto[]>(`${this.spyglassApi}/v1/account/nfts/${address}`).toPromise();
    }

    /** Fetches account delegators. */
    fetchAccountDelegators(address: string, offset: number): Promise<DelegatorsOverviewDto> {
        return this._http
            .post<DelegatorsOverviewDto>(`${this.spyglassApi}/v1/account/delegators`, { address, size: 50, offset })
            .toPromise();
    }

    /** Fetches 50 confirmed transactions for a given address. */
    fetchConfirmedTransactions(address: string, offset: number, pageSize: number): Promise<ConfirmedTransactionDto[]> {
        return this._http
            .post<ConfirmedTransactionDto[]>(`${this.spyglassApi}/v2/account/confirmed-transactions`, {
                address,
                offset,
                size: pageSize,
            })
            .toPromise();
    }

    /** Fetches 50 receivable transactions for a given address. */
    fetchReceivableTransactions(address: string): Promise<ReceivableTransactionDto[]> {
        return this._http
            .post<ReceivableTransactionDto[]>(`${this.spyglassApi}/v1/account/receivable-transactions`, { address })
            .toPromise();
    }

    /** Fetches historic account statistics. */
    fetchInsights(address: string): Promise<InsightsDto> {
        return this._http
            .post<InsightsDto>(`${this.spyglassApi}/v1/account/insights`, { address, includeHeightBalances: true })
            .toPromise();
    }

    /** Given a hash, fetches block. */
    fetchBlock(hash: string): Promise<BlockDto> {
        return this._http.get<BlockDto>(`${this.spyglassApi}/v1/block/${hash}`).toPromise();
    }

    /** Fetches list of known vanities addresses. */
    fetchKnownVanities(): Promise<string[]> {
        return this._http.get<string[]>(`${this.spyglassApi}/v1/known/vanities`).toPromise();
    }

    /** Fetches server stats & info. */
    fetchHostNodeStats(): Promise<HostNodeStatsDto> {
        return this._http.get<HostNodeStatsDto>(`${this.spyglassApi}/v1/network/node-stats`).toPromise();
    }

    /** Fetches monKey avatar for a given account. */
    fetchMonKey(address: string): Promise<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(`https://monkey.banano.cc/api/v1/monkey/${address}`, { headers, responseType: 'text' })
            .toPromise<string>();
    }

    /** Fetches representatives stats. */
    fetchLargeRepresentatives(): Promise<RepresentativeDto[]> {
        return this._http
            .post<RepresentativeDto[]>(`${this.spyglassApi}/v1/representatives`, {
                minimumWeight: 100_000,
                includeDelegatorCount: true,
            })
            .toPromise();
    }

    /** Fetches monitored representatives stats. */
    fetchMonitoredRepresentatives(): Promise<MonitoredRepDto[]> {
        return this._http.get<MonitoredRepDto[]>(`${this.spyglassApi}/v1/representatives/monitored`).toPromise();
    }

    /** Fetches representatives stats. */
    fetchRepresentativeScores(): Promise<RepScoreDto[]> {
        return this._http.get<RepScoreDto[]>(`${this.spyglassApi}/v1/representatives/scores`).toPromise();
    }

    /** Fetches distribute buckets; how many accounts own (1-10 ban, 10-100, etc). */
    fetchDistributionStats(): Promise<AccountDistributionStatsDto> {
        return this._http.get<AccountDistributionStatsDto>(`${this.spyglassApi}/v1/distribution/buckets`).toPromise();
    }

    /** Fetches quorum details. */
    fetchQuorumStats(): Promise<QuorumDto> {
        return this._http.get<QuorumDto>(`${this.spyglassApi}/v1/network/quorum`).toPromise();
    }

    /** Fetches Supply details. */
    fetchSupplyStats(): Promise<SupplyDto> {
        return this._http.get<SupplyDto>(`${this.spyglassApi}/v1/distribution/supply`).toPromise();
    }

    /** Fetches Peer details. */
    fetchPeerVersions(): Promise<PeerVersionsDto[]> {
        return this._http.get<PeerVersionsDto[]>(`${this.spyglassApi}/v1/network/peers`).toPromise();
    }

    /** Fetches how many bad actors required to compromise network. */
    fetchNakamotoCoefficient(): Promise<NakamotoCoefficientDto> {
        return this._http
            .get<NakamotoCoefficientDto>(`${this.spyglassApi}/v1/network/nakamoto-coefficient`)
            .toPromise();
    }

    /** Fetches list of accounts with their respective balance & representative. */
    fetchRichListSegment(offset: number, size: number): Promise<AccountBalanceDto[]> {
        return this._http
            .post<AccountBalanceDto[]>(`${this.spyglassApi}/v1/distribution/rich-list`, {
                offset,
                size,
                includeRepresentative: true,
            })
            .toPromise();
    }

    /** Fetches banano price data. */
    fetchPriceInfo(): Promise<PriceDataDto> {
        return this._http.get<PriceDataDto>(`${this.spyglassApi}/v1/price`).toPromise();
    }

    /** Fetches list of representatives that are considered online. */
    fetchOnlineRepresentatives(): Promise<string[]> {
        return this._http.get<string[]>(`${this.spyglassApi}/v1/representatives/online`).toPromise();
    }

    /** Fetches list of aliases. */
    fetchAliases(): Promise<AliasDto[]> {
        return this._http
            .post<AliasDto[]>(`${this.spyglassApi}/v1/known/accounts`, { includeOwner: false, includeType: false })
            .toPromise();
    }

    /** Fetches list of addresses with known aliases, owner, & type. */
    fetchKnownAccounts(): Promise<KnownAccountDto[]> {
        return this._http
            .post<KnownAccountDto[]>(`${this.spyglassApi}/v1/known/accounts`, { includeOwner: true, includeType: true })
            .toPromise();
    }
}
