import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
// Saves Monkeys to prevent future duplicate requests.  Resets per session.
export class MonkeyCacheService {
    monkeyCache: Map<string, string> = new Map<string, string>();

    addCache(address: string, monkey: string): void {
        this.monkeyCache.set(address, monkey);
    }

    getMonkey(address): string | undefined {
        return this.monkeyCache.get(address);
    }
}
