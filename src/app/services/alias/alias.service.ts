import { ApiService } from '@app/services/api/api.service';
import { AliasDto, SocialMediaAccountAliasDto } from '@app/types/dto';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

type AliasMap = Map<string, { alias: string; socialMedia: string; platformUserId: string }>;

@Injectable({
    providedIn: 'root',
})
/** Fetches account aliases on initialization. */
export class AliasService {
    public aliases: AliasDto[] = [];
    public alias$ = new BehaviorSubject<AliasMap>(new Map());

    private readonly aliasesMap: Map<string, { alias: string; socialMedia: string; platformUserId: string }>;
    private readonly prevSearched: Set<string>;

    constructor(private readonly _api: ApiService) {
        this.aliasesMap = new Map();
        this.prevSearched = new Set();
        this._loadAliases();
    }

    /** Loads a minified address/alias pair for quick searching. */
    private _loadAliases(): void {
        this._api
            .fetchAliases()
            .then((data) => {
                this._storeAliases(data, true);
            })
            .catch(console.error);
    }

    /** Given a set of addresses, makes a series of calls to see if there's any social media data around these accounts. */
    fetchSocialMediaAliases(addresses: Set<string>): void {
        if (!environment.brpd) {
            return;
        }
        addresses.forEach((address) => {
            if (address && !this.prevSearched.has(address) && !this.aliasesMap.has(address)) {
                this.prevSearched.add(address);
                this._api
                    .fetchSocialMediaAccount(address)
                    .then((data) => this._storeAliases([data], false))
                    .catch(console.error);
            }
        });
    }

    /** Simple method to lookup alias, otherwise attempts to fetch it. */
    getAlias(address: string): string {
        if (this.aliasesMap.has(address)) {
            return this.aliasesMap.get(address).alias;
        }
        if (!this.prevSearched.has(address)) {
            this.fetchSocialMediaAliases(new Set([address]));
        }
    }

    getSocialMediaUserId(address: string): string {
        if (this.aliasesMap.has(address)) {
            return this.aliasesMap.get(address).platformUserId;
        }
    }

    get(address: string): { alias: string; socialMedia: string } {
        return this.aliasesMap.get(address);
    }

    private _storeAliases(entries: Array<Partial<SocialMediaAccountAliasDto>>, populateSearchBar: boolean): void {
        for (const data of entries) {
            if (!data.alias || !data.address) {
                continue;
            }
            if (populateSearchBar) {
                this.aliases.push({ alias: data.alias, address: data.address });
            }
            this.aliasesMap.set(data.address, {
                alias: data.alias,
                socialMedia: data.platform,
                platformUserId: data.platformUserId,
            });
        }
        this.alias$.next(this.aliasesMap); // Batching requests together and emitting a single update would be faster.
    }
}
