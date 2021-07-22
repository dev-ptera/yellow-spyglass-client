import { ApiService } from '@app/services/api/api.service';
import { AliasDto } from '@app/types/dto';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
/** Fetches account aliases on initialization. */
export class AliasService {
    aliases: Map<string, string>;

    constructor(private readonly _api: ApiService) {
        this.aliases = new Map<string, string>();
        this.loadAliases();
    }

    loadAliases(): void {
        this._api
            .getAliases()
            .then((data: AliasDto[]) => {
                for (const alias of data) {
                    this.aliases.set(alias.addr, alias.alias);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
