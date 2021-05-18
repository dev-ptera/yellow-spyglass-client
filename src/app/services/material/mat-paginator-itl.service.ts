import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {UtilService} from "../util/util.service";

@Injectable()
export class MatPaginatorIntlCustom extends MatPaginatorIntl {

    constructor(private _util: UtilService) {
        super();
    }

    getRangeLabel = function (page, pageSize, length) {
        return `
        ${this._util.numberWithCommas(length - page * pageSize)} 
        - 
        ${this._util.numberWithCommas(Math.max(1, (length + 1) - (page + 1) * pageSize))}`;
    };
}
