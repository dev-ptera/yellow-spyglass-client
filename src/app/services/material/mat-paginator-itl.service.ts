import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatPaginatorIntlCustom extends MatPaginatorIntl {
    getRangeLabel = function (page, pageSize, length) {
        return `${length - page * pageSize} - ${Math.max(1, length - (page + 1) * pageSize)}`;
    };
}
