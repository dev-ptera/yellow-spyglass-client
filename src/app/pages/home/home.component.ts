import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { SearchService } from '@app/services/search/search.service';
import {ThemeService} from "@app/services/theme/theme.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
    searchFormControl: FormControl;
    loading: boolean;
    error: boolean;
    navigation$;

    constructor(
        public vp: ViewportService,
        private readonly _themeService: ThemeService,
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

    search(searchValue: string, e: MouseEvent): void {
        this._searchService.emitSearch(searchValue, e.ctrlKey);
    }

    isDarkTheme(): boolean {
        return this._themeService.isDarkMode();
    }

    isSearchDisabled(): boolean {
        const value = this.searchFormControl.value;
        return !this._searchService.isValidAddress(value) && !this._searchService.isValidBlock(value);
    }
}
