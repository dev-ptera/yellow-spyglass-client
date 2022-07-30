import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ViewportService} from '@app/services/viewport/viewport.service';
import {FilterDialogData, TransactionsService} from '@app/pages/account/tabs/transactions/transactions.service';

@Component({
    selector: 'app-transaction-filter-drawer',
    template: `
        <div
            style="padding: 16px; padding-bottom: 0; box-sizing: border-box; width: 340px; display: flex; flex-direction: column"
            [style.height]="vp.sm ? '100%' : '100vh'"
        >
            <ng-container *ngIf="!vp.sm">
                <div class="mat-headline" [style.marginTop.px]="vp.sm ? 56 : 64">Transaction Filters</div>
                <div style="margin-bottom: 32px">Use the knobs below to filter your transaction history.</div>
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

            <div style="margin-top: 32px; display: flex; align-items: center; justify-content: space-between">
                <div style="width: 48%">
                    <mat-form-field blui-input style="width: 100%" appearance="fill">
                        <img src="assets/banano-mark-gray.svg" width="20" matSuffix />
                        <mat-label>Min BAN</mat-label>
                        <input matInput type="number" [(ngModel)]="localFilters.minAmount" name="min ban" />
                    </mat-form-field>
                </div>
                <div style="width: 48%">
                    <mat-form-field blui-input style="width: 100%" appearance="fill">
                        <img src="assets/banano-mark-gray.svg" width="20" matSuffix />
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
                        name="excluded addresses"
                        [(ngModel)]="localFilters.excludedAddresses"
                        placeholder="address1, address2, etc"
                    ></textarea>
                </mat-form-field>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center">
                <mat-slider
                    color="primary"
                    style="width: 60%; margin-left: -8px; margin-right: -8px"
                    thumbLabel
                    min="1"
                    max="500"
                    step="1"
                    value="50"
                    [(ngModel)]="localFilters.size"
                ></mat-slider>
                <div>Page Size ({{ localFilters.size }})</div>
            </div>

            <div style="width: 100%; margin-top: 24px;">
                <mat-checkbox color="primary" [(ngModel)]="localFilters.reverse">
                    Reverse Search <span class="mat-hint">(Start Block 1)</span></mat-checkbox
                >
            </div>
            <div style="width: 100%; margin-top: 24px; margin-bottom: 16px">
                <mat-checkbox color="primary" [(ngModel)]="localFilters.showKnownAccounts">Only Show Known Accounts</mat-checkbox>
            </div>
            <blui-spacer></blui-spacer>
            <mat-divider style="margin-left: -16px; margin-right: -16px"></mat-divider>
            <div
                style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0;"
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
})
export class FilterDrawerComponent {
    @Input() defaultPageSize;
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

    /** Results filters to their default state. */
    resetFilters(): void {
        this.localFilters = Object.assign({}, {
            includeReceive: true,
            includeChange: true,
            includeSend: true,
            maxAmount: undefined,
            maxBlock: undefined,
            minBlock: undefined,
            size: this.defaultPageSize,
            minAmount: undefined,
            filterAddresses: '',
            excludedAddresses: '',
            reverse: false,
            showKnownAccounts: false,
        });
    }
}
