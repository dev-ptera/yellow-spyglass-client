import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';

/** Paginator component.  Pages start at index 0. */
@Component({
    selector: 'app-wallet-paginator',
    encapsulation: ViewEncapsulation.None,
    template: `
        <ng-container *transloco="let t; scope: 'wallets'; read: 'wallets'">
            <div style="display: flex; align-items: center; height: 56px" class="text-secondary">
                <ng-container *ngIf="maxElements > pageSize">
                    <button
                        mat-icon-button
                        [disabled]="pageIndex === 0 || disableMove"
                        [style.marginRight.px]="vp.sm ? 0 : 8"
                        (click)="firstPage()"
                    >
                        <mat-icon>first_page</mat-icon>
                    </button>
                    <button mat-icon-button [disabled]="pageIndex === 0 || disableMove" (click)="prevPage()">
                        <mat-icon>chevron_left</mat-icon>
                    </button>
                </ng-container>
                <blui-spacer></blui-spacer>
                <div [style.fontSize.px]="vp.sm ? 12 : 14">
                    {{
                        t('table.paginator', {
                            pageMin: getCurrPageMin(),
                            pageMax: getCurrPageMax(),
                            pages: util.numberWithCommas(maxElements)
                        })
                    }}
                </div>
                <blui-spacer></blui-spacer>
                <ng-container *ngIf="maxElements > pageSize">
                    <button
                        mat-icon-button
                        [disabled]="isMaxPageNum() || disableMove"
                        [style.marginRight.px]="vp.sm ? 0 : 8"
                        (click)="nextPage()"
                    >
                        <mat-icon>chevron_right</mat-icon>
                    </button>
                    <button mat-icon-button [disabled]="isMaxPageNum() || disableMove" (click)="lastPage()">
                        <mat-icon>last_page</mat-icon>
                    </button>
                </ng-container>
            </div>
        </ng-container>
    `,
})
export class WalletPaginatorComponent implements OnInit {
    @Input() pageIndex = 0;
    @Input() pageSize: number;
    @Input() maxElements: number;
    @Input() disableMove = false;

    @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();

    maxPageNumber: number;

    constructor(
        public util: UtilService,
        public vp: ViewportService
    ) {}

    ngOnInit(): void {
        this.maxPageNumber = Math.floor(this.maxElements / this.pageSize);
    }

    isMaxPageNum(): boolean {
        return this.pageIndex === this.maxPageNumber;
    }

    firstPage(): void {
        this.pageIndex = 0;
        this.pageIndexChange.emit(this.pageIndex);
    }

    prevPage(): void {
        this.pageIndex -= 1;
        this.pageIndexChange.emit(this.pageIndex);
    }

    nextPage(): void {
        this.pageIndex++;
        this.pageIndexChange.emit(this.pageIndex);
    }

    lastPage(): void {
        this.pageIndex = this.maxPageNumber;
        this.pageIndexChange.emit(this.pageIndex);
    }

    getCurrPageMin(): string {
        return this.util.numberWithCommas(this.pageIndex * this.pageSize + 1);
    }

    getCurrPageMax(): string {
        return this.util.numberWithCommas(Math.min(this.maxElements, (this.pageIndex + 1) * this.pageSize));
    }
}
