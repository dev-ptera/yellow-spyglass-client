import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    search$ = new Subject<{ search: string; openInNewWindow: boolean }>();

    constructor(router: Router) {
        this.searchEvents().subscribe((data: { search: string; openInNewWindow: boolean }) => {
            if (data.openInNewWindow) {
                if (data.search.startsWith('ban_') || this.isValidBNSDomain(data.search)) {
                    const origin = window.location.origin;
                    window.open(`${origin}/${APP_NAV_ITEMS.account.route}/${data.search}`, '_blank');
                } else {
                    window.open(`${origin}/${APP_NAV_ITEMS.hash.route}/${data.search}`, '_blank');
                }
            } else {
                if (data.search.startsWith('ban_') || this.isValidBNSDomain(data.search)) {
                    void router.navigate([`${APP_NAV_ITEMS.account.route}/${data.search}`]);
                } else {
                    void router.navigate([`${APP_NAV_ITEMS.hash.route}/${data.search}`]);
                }
            }
        });
    }

    searchEvents(): Observable<{ search: string; openInNewWindow: boolean }> {
        return this.search$;
    }

    emitSearch(search: string, openInNewWindow = true): void {
        if (!search) {
            return;
        }
        const trimmed = search.trim();
        this.search$.next({ search: trimmed, openInNewWindow });
    }

    isValidAddress(address: string): boolean {
        return address && address.length === 64 && address.startsWith('ban_');
    }

    isValidBlock(block: string): boolean {
        return block && block.length === 64;
    }

    isValidBNSDomain(bns: string): boolean {
        const parts = bns.split(".");
        //later, can also check for illegal characters once that is more settled
        return parts.length === 2 && parts[0].length <= 32;
    }
}
