import { ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { DelegatorsTabService } from '@app/pages/account/tabs/delegators/delegators-tab.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';

@Component({
    selector: 'account-delegators-tab',
    styleUrls: ['delegators-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
    template: `
        <ng-container *ngIf="delegatorService.hasDelegators()">
            <div class="account-delegator-weight">
                <span class="account-delegator-weight-sum" responsive>{{ delegatorService.getWeight() }}</span>
                <span class="account-delegator-weight-sum-description text-secondary" responsive>BAN Delegated Weight</span>
            </div>
            <mat-divider></mat-divider>
            <table mat-table [style.width.%]="100" [dataSource]="delegatorService.getTableDataSource()" responsive>
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
                        class="delegators-address-cell mono"
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
            <div class="text-secondary" style="padding: 16px;" [style.fontSize.px]="vp.sm ? 10 : 14">
                Accounts with a 0 BANANO balance have been removed from the total delegators count.
            </div>
            <div style="text-align: center; padding: 16px" *ngIf="delegatorService.canLoadMoreDelegators()">
                <button
                    color="primary"
                    mat-stroked-button
                    [disabled]="delegatorService.isLoadingDelegators()"
                    (click)="loadMoreDelegators()"
                >
                    Load more
                </button>
            </div>
        </ng-container>

        <div *ngIf="!delegatorService.hasDelegators()" class="tab-empty-state">
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
})
export class DelegatorsTabComponent {
    @Input() address: string;

    navItems = APP_NAV_ITEMS;
    columns = ['position', 'address', 'weight'];

    constructor(
        public vp: ViewportService,
        public delegatorService: DelegatorsTabService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    async loadMoreDelegators(): Promise<void> {
        await this.delegatorService.fetchDelegators(this.address);
        this._ref.detectChanges();
    }
}
