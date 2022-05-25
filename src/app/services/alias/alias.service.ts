import { ApiService } from '@app/services/api/api.service';
import { AliasDto } from '@app/types/dto';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
/** Fetches account aliases on initialization. */
export class AliasService {
    private readonly aliases: Map<string, string>;

    constructor(private readonly _api: ApiService) {
        this.aliases = new Map<string, string>();
        this._loadAliases();
    }

    private _loadAliases(): void {
        this._api
            .fetchAliases()
            .then((data: AliasDto[]) => {
                for (const alias of data) {
                    this.aliases.set(alias.address, alias.alias);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    has(address: string): boolean {
        return this.aliases.has(address);
    }

    get(address: string): string {
        return this.aliases.get(address);
    }
}
