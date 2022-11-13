import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FilterDialogData, TransactionsService } from '@app/services/transactions/transactions.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-transaction-filter-drawer',
    template: `
        <div class="filter-container" [style.height]="vp.sm ? '100%' : '100vh'">
            <div
                style="height: 100%; overflow:auto; box-sizing: border-box; padding-left: 16px; padding-right: 16px"
                [style.marginBottom.px]="32"
                [style.marginTop.px]="80"
            >
                <ng-container *ngIf="!vp.sm">
                    <div style="display: flex; justify-content: space-between; align-items: center">
                        <div class="mat-headline" style="margin-bottom: 0">Transaction Filters</div>
                        <button mat-icon-button (click)="close.emit()">
                            <mat-icon>close</mat-icon>
                        </button>
                    </div>
                    <div style="margin-bottom: 24px">Use the knobs below to filter your transaction history.</div>
                </ng-container>

                <mat-chip-list multiple>
                    <mat-chip
                        variant="outline"
                        color="primary"
                        (click)="localFilters.includeReceive = !localFilters.includeReceive"
                        [selected]="localFilters.includeReceive"
                    >
                        <mat-icon matChipAvatar style="font-size: 16px">download</mat-icon>
                        Received
                    </mat-chip>
                    <mat-chip
                        variant="outline"
                        color="primary"
                        (click)="localFilters.includeSend = !localFilters.includeSend"
                        [selected]="localFilters.includeSend"
                    >
                        <mat-icon matChipAvatar style="font-size: 16px">upload</mat-icon>
                        Sent
                    </mat-chip>
                    <mat-chip
                        variant="outline"
                        color="primary"
                        (click)="localFilters.includeChange = !localFilters.includeChange"
                        [selected]="localFilters.includeChange"
                    >
                        <mat-icon matChipAvatar style="font-size: 16px">how_to_vote</mat-icon>
                        Change
                    </mat-chip>
                </mat-chip-list>

                <div style="margin-top: 24px; display: flex; align-items: center; justify-content: space-between">
                    <div style="width: 48%">
                        <mat-form-field blui-input style="width: 100%" appearance="fill">
                            <img src="assets/icons/banano-mark-gray.svg" width="20" matSuffix />
                            <mat-label>Min BAN</mat-label>
                            <input matInput type="number" [(ngModel)]="localFilters.minAmount" name="min ban" />
                        </mat-form-field>
                    </div>
                    <div style="width: 48%">
                        <mat-form-field blui-input style="width: 100%" appearance="fill">
                            <img src="assets/icons/banano-mark-gray.svg" width="20" matSuffix />
                            <mat-label>Max BAN</mat-label>
                            <input matInput type="number" [(ngModel)]="localFilters.maxAmount" name="max ban" />
                        </mat-form-field>
                    </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between">
                    <div style="width: 48%">
                        <mat-form-field blui-input style="width: 100%" appearance="fill">
                            <mat-label>Min Block</mat-label>
                            <mat-icon matSuffix>start</mat-icon>
                            <input matInput type="number" [(ngModel)]="localFilters.minBlock" name="min block" />
                        </mat-form-field>
                    </div>
                    <div style="width: 48%">
                        <mat-form-field blui-input style="width: 100%" appearance="fill">
                            <mat-label>Max Block</mat-label>
                            <mat-icon matSuffix style="transform: rotate(180deg)">start</mat-icon>
                            <input matInput type="number" [(ngModel)]="localFilters.maxBlock" name="max block" />
                        </mat-form-field>
                    </div>
                </div>

                <div style="width: 100%">
                    <mat-form-field style="width: 100%" appearance="fill">
                        <mat-label>Included Addresses</mat-label>
                        <mat-icon matSuffix>filter_list</mat-icon>
                        <textarea
                            matInput
                            type="text"
                            name="include addresses"
                            style="min-height: 75px"
                            [(ngModel)]="localFilters.filterAddresses"
                            placeholder="address1, address2, etc"
                        ></textarea>
                    </mat-form-field>
                </div>

                <div style="width: 100%">
                    <mat-form-field style="width: 100%" appearance="fill">
                        <mat-label>Excluded Addresses</mat-label>
                        <mat-icon matSuffix>filter_list_off</mat-icon>
                        <textarea
                            matInput
                            type="text"
                            style="min-height: 75px"
                            name="excluded addresses"
                            [(ngModel)]="localFilters.excludedAddresses"
                            placeholder="address1, address2, etc"
                        ></textarea>
                    </mat-form-field>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center">
                    <mat-slider
                        color="primary"
                        style="width: 60%; margin:0; box-sizing: border-box"
                        thumbLabel
                        min="10"
                        max="500"
                        step="1"
                        value="50"
                        [(ngModel)]="localFilters.size"
                    ></mat-slider>
                    <div>Page Size ({{ localFilters.size }})</div>
                </div>

                <div style="width: 100%; margin-top: 16px;">
                    <mat-checkbox color="primary" [(ngModel)]="localFilters.reverse">
                        Reverse Search <span class="mat-hint">(Start at Block 1)</span>
                    </mat-checkbox>
                </div>
                <div style="width: 100%; margin-top: 16px; margin-bottom: 16px" *ngIf="isBRPD()">
                    <mat-checkbox color="primary" [(ngModel)]="localFilters.onlyIncludeKnownAccounts">
                        Only Show Known Accounts
                    </mat-checkbox>
                </div>
                <div style="width: 100%; margin-top: 16px; margin-bottom: 16px" *ngIf="isBRPD()">
                    <mat-checkbox color="primary" [(ngModel)]="localFilters.onlyIncludeUnknownAccounts">
                        Only Show Unknown Accounts
                    </mat-checkbox>
                </div>
            </div>
            <blui-spacer></blui-spacer>
            <mat-divider></mat-divider>
            <div
                style="display: flex; justify-content: space-between; align-items: center; padding: 16px; flex: 1 1 0px"
            >
                <button
                    style="width: 130px"
                    mat-flat-button
                    color="primary"
                    (click)="applyFilters()"
                    [disabled]="txService.isLoadingConfirmedTransactions"
                >
                    Apply
                </button>

                <button style="width: 130px" (click)="resetFilters()" mat-stroked-button>Reset</button>
            </div>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
            .filter-container {
                box-sizing: border-box;
                width: 345px;
                display: flex;
                flex-direction: column;
            }
            .filter-container .mat-chip-list-wrapper {
                margin: 0;
            }
        `,
    ],
})
export class FilterDrawerComponent {
    @Input() defaultPageSize;
    @Output() close = new EventEmitter<void>();
    @Output() search = new EventEmitter<void>();

    localFilters: FilterDialogData;

    constructor(public vp: ViewportService, public txService: TransactionsService) {}

    ngOnInit(): void {
        this.resetFilters();
        this.txService.setFilters(this.localFilters);
    }

    applyFilters(): void {
        this.txService.forgetConfirmedTransactions();
        this.txService.setFilters(this.localFilters);
        void this.txService.loadConfirmedTransactionsPage(0, this.localFilters.size);
        this.search.emit();
    }

    isBRPD(): boolean {
        return environment.brpd;
    }

    /** Results filters to their default state. */
    resetFilters(): void {
        this.localFilters = this.txService.createNewFilterObject();
    }
}
