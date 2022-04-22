import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    search$ = new Subject<{ search: string; openInNewWindow: boolean }>();

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
}
