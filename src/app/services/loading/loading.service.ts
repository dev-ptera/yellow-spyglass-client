import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    loading$ = new Subject<boolean>();

    searchEvents(): Observable<boolean> {
        return this.loading$;
    }

    emitLoad(loading: boolean): void {
        this.loading$.next(loading);
    }
}
