import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilService {
    numberWithCommas(x) {
        return x.toLocaleString();
    }
}
