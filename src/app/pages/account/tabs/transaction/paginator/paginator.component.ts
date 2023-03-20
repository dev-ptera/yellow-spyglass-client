import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { Subscription } from 'rxjs';
import { TransactionsService } from '@app/services/transactions/transactions.service';

/** Paginator component.  Pages start at index 0. */
@Component({
    selector: 'app-tx-paginator',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div style="display: flex; align-items: center; height: 56px" class="text-secondary">
            <ng-container *ngIf="blockCount > pageSize">
                <button
                    mat-icon-button
                    [disabled]="displayedPageNumber === 0 || txService.isLoadingConfirmedTransactions"
                    [style.marginRight.px]="vp.sm ? 0 : 8"
                    (click)="goFirstPage()"
                >
                    <mat-icon>first_page</mat-icon>
                </button>
                <button
                    mat-icon-button
                    [disabled]="displayedPageNumber === 0 || txService.isLoadingConfirmedTransactions"
                    (click)="goPrevPage()"
                >
                    <mat-icon>chevron_left</mat-icon>
                </button>
            </ng-container>
            <blui-spacer></blui-spacer>
            <div [style.fontSize.px]="vp.sm ? 12 : 14">
                Page {{ displayedPageNumber + 1 }} <span style="margin: 0 8px">·</span> {{ pageSize }} items / page
            </div>
            <mat-spinner
                *ngIf="txService.isLoadingConfirmedTransactions"
                [diameter]="16"
                style="margin-left: 12px; margin-right: -28px"
            ></mat-spinner>
            <blui-spacer></blui-spacer>
            <ng-container *ngIf="blockCount > pageSize">
                <button
                    mat-icon-button
                    [disabled]="
                        isMaxPageNum() || txService.isLoadingConfirmedTransactions || txService.hasReachedLastPage()
                    "
                    [style.marginRight.px]="vp.sm ? 0 : 8"
                    (click)="goNextPage()"
                >
                    <mat-icon>chevron_right</mat-icon>
                </button>
                <button
                    *ngIf="!txService.hasFiltersApplied()"
                    mat-icon-button
                    [disabled]="
                        isMaxPageNum() || txService.isLoadingConfirmedTransactions || txService.hasReachedLastPage()
                    "
                    (click)="goLastPage()"
                >
                    <mat-icon>last_page</mat-icon>
                </button>
            </ng-container>
        </div>
    `,
})
export class TxPaginatorComponent implements OnChanges, OnDestroy {
    @Input() blockCount: number;

    pageSize: number;
    displayedPageNumber: number;

    private readonly pageLoad$: Subscription;
    private maxPageNumber: number;

    constructor(public util: UtilService, public vp: ViewportService, public txService: TransactionsService) {
        this.goFirstPage();

        // Initial state
        this.displayedPageNumber = 0;
        this.pageSize = this.txService.filterData.size;

        this.pageLoad$ = this.txService.emitPageLoad().subscribe(() => {
            this.displayedPageNumber = this.txService.confirmedTransactions.currentPage;
            this.pageSize = this.txService.filterData.size;
            this._calcMaxPageNumber();
        });
    }

    ngOnDestroy(): void {
        if (this.pageLoad$) {
            this.pageLoad$.unsubscribe();
        }
    }

    ngOnChanges(): void {
        this._calcMaxPageNumber();
    }

    private _calcMaxPageNumber(): void {
        this.maxPageNumber = Math.ceil(this.blockCount / this.pageSize) - 1;
    }

    isMaxPageNum(): boolean {
        return this.displayedPageNumber === this.maxPageNumber;
    }

    goFirstPage(): void {
        this.loadPage(0);
    }

    goPrevPage(): void {
        this.loadPage(this.displayedPageNumber - 1);
    }

    goNextPage(): void {
        this.loadPage(this.displayedPageNumber + 1);
    }

    goLastPage(): void {
        this.loadPage(this.maxPageNumber);
    }

    loadPage(page: number): void {
        void this.txService.loadConfirmedTransactionsPage(page, this.pageSize).catch((err) => {
            console.error(err);
        });
    }
}
