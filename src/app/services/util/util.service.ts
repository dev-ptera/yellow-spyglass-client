import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UtilService {

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

}
