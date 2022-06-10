import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { DelegatorDto } from '@app/types/dto/DelegatorDto';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';

@Component({
    selector: 'account-delegators-tab',
    template: `
        <div class="account-delegator-weight" *ngIf="weightSum !== 0">
            <span class="account-delegator-weight-sum" responsive>{{ formattedWeight }}</span>
            <span class="account-delegator-weight-sum-description" responsive>BAN Delegated Weight</span>
        </div>
        <mat-divider *ngIf="delegators.length !== 0"></mat-divider>
        <table
            mat-table
            *ngIf="delegators.length > 0"
            [style.width.%]="100"
            [dataSource]="delegatorsDatasource"
            responsive
        >
            <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef mat-sort-header></th>
                <td
                    mat-cell
                    class="text-secondary"
                    [style.paddingRight.px]="16"
                    *matCellDef="let element; let i = index"
                >
                    {{ i + 1 }}
                </td>
            </ng-container>

            <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Address</th>
                <td
                    mat-cell
                    class="delegators-address-cell"
                    style="word-break: break-all"
                    [class.link]="element.address !== address"
                    *matCellDef="let element"
                >
                    <a class="text link" [routerLink]="'/' + navItems.account.route + '/' + element.address">
                        {{ element.address }}
                    </a>
                    <span
                        *ngIf="element.address === address"
                        class="text-secondary mat-body-2"
                        style="margin-left: 8px;; word-break: normal"
                        >(This Account)</span
                    >
                </td>
            </ng-container>
            <ng-container matColumnDef="weight">
                <th mat-header-cell [style.paddingLeft.px]="16" *matHeaderCellDef>Weight</th>
                <td mat-cell [style.paddingLeft.px]="16" *matCellDef="let element">{{ element.weight }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
        <div
            *ngIf="delegators.length > 0"
            class="text-secondary"
            [style.fontSize.px]="vp.sm ? 10 : 14"
            style="padding: 16px;"
        >
            Accounts with a 0 BANANO balance have been removed from the total delegators count.
        </div>
        <div style="text-align: center; padding: 16px" *ngIf="delegators.length < delegatorsCount">
            <button
                color="primary"
                [disabled]="isLoading"
                mat-stroked-button
                (click)="loadMoreDelegators.emit(); isLoading = true"
            >
                Load more
            </button>
        </div>

        <div *ngIf="delegators.length === 0" class="tab-empty-state">
            <blui-empty-state
                responsive
                class="account-empty-state"
                title="No Delegators"
                description="This account has no delegated weight.  If this account is not running a node, this is a good thing."
            >
                <mat-icon blui-empty-icon>how_to_vote</mat-icon>
            </blui-empty-state>
        </div>
    `,
    styleUrls: ['delegators-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DelegatorsTabComponent implements OnChanges {
    @Input() address: string;
    @Input() delegatorsCount: number;
    @Input() loadedDelegatorsCount: number;
    @Input() delegators: DelegatorDto[];
    @Input() weightSum: number;
    @Output() loadMoreDelegators = new EventEmitter<void>();

    isLoading: boolean;

    navItems = APP_NAV_ITEMS;

    columns = ['position', 'address', 'weight'];
    delegatorsDatasource;

    formattedWeight: string;

    constructor(public vp: ViewportService, public util: UtilService, private readonly _ref: ChangeDetectorRef) {}

    ngOnChanges(): void {
        this.isLoading = false;
        this.delegatorsDatasource = [];

        if (this.weightSum) {
            this.formattedWeight = this.util.numberWithCommas(this.weightSum.toFixed(2));
        } else {
            this.formattedWeight = '0';
        }
        this.delegators.map((delegator) => {
            delegator.weight = this.util.numberWithCommas(delegator.weight) as any;
            this.delegatorsDatasource.push(delegator);
        });
    }
}
