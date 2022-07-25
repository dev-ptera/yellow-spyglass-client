import { ApiService } from '@app/services/api/api.service';
import { AliasDto } from '@app/types/dto';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
/** Fetches account aliases on initialization. */
export class AliasService {
    private readonly aliases: Map<string, { alias: string; socialMedia: string; platformUserId: string }>;
    private readonly accountsWithNoAlias: Set<string>;

    constructor(private readonly _api: ApiService) {
        this.aliases = new Map();
        this.accountsWithNoAlias = new Set();
        this._loadAliases();
    }

    /** Loads a minified address/alias pair for quick searching. */
    private _loadAliases(): void {
        this._api
            .fetchAliases()
            .then((data: AliasDto[]) => {
                for (const account of data) {
                    this.aliases.set(account.address, {
                        alias: account.alias,
                        socialMedia: undefined,
                        platformUserId: undefined,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /** Given a set of addresses, makes a series of calls to see if there's any social media data around these accounts. */
    fetchSocialMediaAliases(addresses: Set<string>): void {
        addresses.forEach((address) => {
            if (address && !this.accountsWithNoAlias.has(address) && !this.aliases.has(address)) {
                this._api
                    .fetchSocialMediaAccount(address)
                    .then((data) => {
                        if (data.alias) {
                            this.aliases.set(address, {
                                alias: data.alias,
                                socialMedia: data.platform,
                                platformUserId: data.platformUserId,
                            });
                        } else {
                            this.accountsWithNoAlias.add(address);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        this.accountsWithNoAlias.add(address);
                    });
            }
        });
    }

    has(address: string): boolean {
        return this.aliases.has(address);
    }

    getAlias(address: string): string {
        if (this.has(address)) {
            return this.aliases.get(address).alias;
        }
    }

    getSocialMediaUserId(address: string): string {
        if (this.has(address)) {
            return this.aliases.get(address).platformUserId;
        }
    }

    getSocialMedia(address: string): string {
        if (this.has(address)) {
            return this.aliases.get(address).socialMedia;
        }
    }

    get(address: string): { alias: string; socialMedia: string } {
        return this.aliases.get(address);
    }
}
