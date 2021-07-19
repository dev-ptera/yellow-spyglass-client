import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';

// eslint-disable-next-line no-shadow
enum REASON {
    OFFLINE = 1,
    LARGE,
}

@Injectable({
    providedIn: 'root',
})
// Toot a specific message to select addresses
export class MegaphoneService {
    hasOfflineRep = new Set<string>();
    hasLargeRep = new Set<string>();

    constructor(private readonly _api: ApiService) {}

    hasAddress(address: string): boolean {
        return this.hasLargeRep.has(address) || this.hasOfflineRep.has(address);
    }

    reset(): void {
        this.hasOfflineRep.clear();
        this.hasLargeRep.clear();
    }

    addAddress(address: string, reason: REASON): void {
        if (reason === 1) {
            this.hasOfflineRep.add(address);
        }
        if (reason === 2) {
            this.hasLargeRep.add(address);
        }
    }

    removeAddress(address: string): void {
        this.hasOfflineRep.delete(address);
        this.hasLargeRep.delete(address);
    }

    toot(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._api
                .megaphone(Array.from(this.hasOfflineRep), Array.from(this.hasLargeRep))
                .then(resolve)
                .catch(reject);
        });
    }
}
