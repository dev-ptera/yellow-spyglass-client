import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'app-paginator',
    encapsulation: ViewEncapsulation.None,
    template: `
        <div style="display: flex; align-items: center; height: 56px">
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
            <pxb-spacer></pxb-spacer>
            <div [style.fontSize.px]="vp.sm ? 14 : 16">
                Showing
                <strong>{{ getCurrPageMin() }}</strong>
                to
                <strong>{{ getCurrPageMax() }}</strong>
                of
                <strong>{{ util.numberWithCommas(maxElements) }}</strong>
            </div>
            <pxb-spacer></pxb-spacer>
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
    `,
})
export class PaginatorComponent implements OnChanges {
    @Input() pageIndex = 0;
    @Input() pageSize: number;
    @Input() maxElements: number;
    @Input() disableMove = false;

    @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();

    maxPageNumber: number;

    constructor(public util: UtilService, public vp: ViewportService) {}

    ngOnChanges(): void {
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
