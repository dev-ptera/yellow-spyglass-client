import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    search$ = new Subject<string>();

    searchEvents(): Observable<string> {
        return this.search$;
    }

    emitSearch(search: string): void {
        this.search$.next(search);
    }
}
