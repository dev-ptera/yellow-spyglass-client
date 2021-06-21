import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ApiService} from '@app/services/api/api.service';
import {KnownAccountDto,} from '@app/types/dto';
import {SearchService} from "@app/services/search/search.service";
import {ViewportService} from "@app/services/viewport/viewport.service";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-known-accounts',
    templateUrl: './known-accounts.component.html',
    styleUrls: ['./known-accounts.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class KnownAccountsComponent implements OnInit {

    accountsDataSource;
    loading = true;
    displayedColumns = ['alias',  'address', 'tag'];
    @ViewChild('sort') sort: MatSort;

    constructor(private readonly _api: ApiService, private readonly _searchService: SearchService, public vp: ViewportService) {
    }

    ngOnInit(): void {
        this._api.getKnownAccounts().then((data: KnownAccountDto[]) => {
            this.loading = false;
            this.accountsDataSource = new MatTableDataSource(data);
            this.accountsDataSource.sort = this.sort;
        }).catch((err) => {
            console.error(err);
            this.loading = false;
        })
    }

    routeRepAddress(address: string): void {
        this._searchService.emitSearch(address);
    }

}
