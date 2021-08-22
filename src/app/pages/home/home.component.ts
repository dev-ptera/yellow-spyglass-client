import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
    searchFormControl: FormControl;
    idFieldActive: boolean;
    touchedIdField: boolean;
    loading: boolean;
    error: boolean;
    gettingStarted = false;
    navigation$;

    sampleAddresses = ['ban_39qbrcfii4imaekkon7gqs1emssg7pfhiirfg7u85nh9rnf51zbmr84xrtbp'];

    sampleTransactions = ['EA3A67403F255C47AE1698350D1BA2D8CD3C108A8688144B191ED6BBE60EF91D'];

    constructor(
        public vp: ViewportService,
        private readonly _searchService: SearchService,
        private readonly _util: UtilService,
        private readonly _router: Router
    ) {}

    ngOnInit(): void {
        this.searchFormControl = new FormControl();
    }

    ngOnDestroy(): void {
        if (this.navigation$) {
            this.navigation$.unsubscribe();
        }
    }

    search(searchValue: string): void {
        this._searchService.emitSearch(searchValue);
    }

    shortenAddress(addr: string): string {
        return this._util.shortenAddress(addr);
    }

    formatShortenedTx(tx: string): string {
        return `${tx.substr(0, 15)}...`;
    }
}
