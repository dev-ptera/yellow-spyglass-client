import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';

@Injectable({
    providedIn: 'root',
})
export class OnlineRepsService {
    onlineReps: Set<string> = new Set<string>();

    constructor(private readonly _api: ApiService) {
        this.refreshOnlineReps();
        setInterval(() => {
            this.refreshOnlineReps();
        }, 60000 * 1);
    }

    refreshOnlineReps(): void {
        this._api
            .getOnlineReps()
            .then((data) => {
                this.onlineReps.clear();
                data.map((rep) => this.onlineReps.add(rep));
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
