import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import {Subscription} from "rxjs";
import {TransactionsService} from "@app/pages/account/tabs/transactions/transactions.service";

/** Paginator component.  Pages start at index 0. */
@Component({
    selector: 'app-paginator',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div style="display: flex; align-items: center; height: 56px" class="text-secondary">
            <ng-container *ngIf="blockCount > pageSize">
                <button
                    mat-icon-button
                    [disabled]="pageIndex === 0 || disableMove"
                    [style.marginRight.px]="vp.sm ? 0 : 8"
                    (click)="goFirstPage()"
                >
                    <mat-icon>first_page</mat-icon>
                </button>
                <button mat-icon-button [disabled]="pageIndex === 0 || disableMove" (click)="goPrevPage()">
                    <mat-icon>chevron_left</mat-icon>
                </button>
            </ng-container>
            <blui-spacer></blui-spacer>
            <div *ngIf="!showPageNumberOnly" [style.fontSize.px]="vp.sm ? 12 : 14">
                Showing
                <span>{{ getCurrPageMin() }}</span>
                to
                <span>{{ getCurrPageMax() }}</span>
                of
                <span>{{ util.numberWithCommas(blockCount) }}</span>
            </div>
            <div *ngIf="showPageNumberOnly" [style.fontSize.px]="vp.sm ? 12 : 14">
                Page {{ pageIndex + 1 }} <span style="margin: 0 8px">·</span> {{ pageSize }} items / page
            </div>
            <blui-spacer></blui-spacer>
            <ng-container *ngIf="blockCount > pageSize">
                <button
                    mat-icon-button
                    [disabled]="isMaxPageNum() || disableMove"
                    [style.marginRight.px]="vp.sm ? 0 : 8"
                    (click)="goNextPage()"
                >
                    <mat-icon>chevron_right</mat-icon>
                </button>
                <button
                    *ngIf="enableFastForward"
                    mat-icon-button
                    [disabled]="isMaxPageNum() || disableMove"
                    (click)="goLastPage()"
                >
                    <mat-icon>last_page</mat-icon>
                </button>
            </ng-container>
        </div>
    `,
})
export class PaginatorComponent implements OnChanges {
    @Input() pageSize: number;
    @Input() blockCount: number;
    @Input() disableMove = false;
    @Input() showPageNumberOnly = false;
    @Input() enableFastForward = true;

    @Input() pageIndex = 0;
    @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();

    maxPageNumber: number;

    pageLoad$: Subscription;

    constructor(public util: UtilService, public vp: ViewportService, private readonly _txService: TransactionsService) {}

    ngOnInit(): void {
        this.pageLoad$ = this._txService.emitPageLoad().subscribe(() => {
            if (this._txService.maxPageLoaded === 0) {
               // this.goFirstPage();
            }
        });
    }

    ngOnChanges(): void {
        this.maxPageNumber = Math.ceil(this.blockCount / this.pageSize) - 1;
    }

    isMaxPageNum(): boolean {
        return this.pageIndex === this.maxPageNumber;
    }

    goFirstPage(): void {
        this.pageIndex = 0;
        this.pageIndexChange.emit(this.pageIndex);
    }

    goPrevPage(): void {
        this.pageIndex -= 1;
        this.pageIndexChange.emit(this.pageIndex);
    }

    goNextPage(): void {
        this.pageIndex++;
        this.pageIndexChange.emit(this.pageIndex);
    }

    goLastPage(): void {
        this.pageIndex = this.maxPageNumber;
        this.pageIndexChange.emit(this.pageIndex);
    }

    getCurrPageMin(): string {
        return this.util.numberWithCommas(this.pageIndex * this.pageSize + 1);
    }

    getCurrPageMax(): string {
        return this.util.numberWithCommas(Math.min(this.blockCount, (this.pageIndex + 1) * this.pageSize));
    }
}
