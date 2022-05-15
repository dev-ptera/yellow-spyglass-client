import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';

@Injectable({
    providedIn: 'root',
})
/**
 /** Fetches online representatives on initialization.
 *  Refreshes every minute.
 */
export class OnlineRepsService {
    onlineReps: Set<string> = new Set<string>();

    constructor(private readonly _api: ApiService) {
        this._refreshOnlineReps();
        setInterval(() => {
            this._refreshOnlineReps();
        }, 60000 * 1);
    }

    private _refreshOnlineReps(): void {
        this._api
            .fetchOnlineRepresentatives()
            .then((data) => {
                this.onlineReps.clear();
                data.map((rep) => this.onlineReps.add(rep));
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
