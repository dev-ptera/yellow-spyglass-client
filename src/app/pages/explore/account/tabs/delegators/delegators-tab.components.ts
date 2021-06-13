import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { Delegator } from '@app/types/modal/Delegator';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import {ViewportService} from "@app/services/viewport/viewport.service";

@Component({
    selector: 'account-delegators-tab',
    template: `
        <div class="account-delegator-weight" *ngIf="weightSum !== 0">
            <span class="account-delegator-weight-sum" responsive>{{ formattedWeight }}</span>
            <span class="account-delegator-weight-sum-description" responsive>BAN Delegated Weight</span>
        </div>
        <table
            mat-table
            *ngIf="delegators.length > 0"
            [style.width.%]="100"
            [dataSource]="getShownDelegators()"
        >
            <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef mat-sort-header></th>
                <td mat-cell [style.paddingRight.px]="16" *matCellDef="let element; let i = index">#{{ i + 1 }}</td>
            </ng-container>

            <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Address</th>
                <td
                    mat-cell
                    [style.paddingTop.px]="8"
                    [style.paddingBottom.px]="8"
                    class="account-delegator-address-cell"
                    *matCellDef="let element"
                    (click)="searchService.emitSearch(element.address)"
                >
                    {{ element.address }}
                </td>
            </ng-container>
            <ng-container matColumnDef="weight">
                <th mat-header-cell [style.paddingLeft.px]="16" *matHeaderCellDef>Weight (BAN)</th>
                <td mat-cell [style.paddingLeft.px]="16" *matCellDef="let element">{{ element.weight }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
        <div *ngIf="delegators.length > 0"
             [style.paddingLeft.px]="16" 
             [style.fontSize.px]="vp.sm ? 10 : 14"
             style="margin: 16px 0;">
            *Accounts with a 0 BANANO balance have been removed from the total delegators count.
        </div>
        <div style="text-align: center; margin-top: 16px" *ngIf="delegators.length > shownDelegators">
            <button color="primary" style="padding: 8px 16px" mat-stroked-button (click)="increaseShownDelegators()">
                Load more
            </button>
        </div>

        <pxb-empty-state
            responsive
            *ngIf="delegators.length === 0"
            class="account-empty-state"
            title="No Delegators"
            description="This account has no delegated weight.  If this account is not running a node, this is a good thing."
        >
            <mat-icon pxb-empty-icon>how_to_vote</mat-icon>
        </pxb-empty-state>
    `,
    styleUrls: ['delegators-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DelegatorsTabComponent implements OnChanges {
    @Input() delegators: Delegator[];
    @Input() weightSum: number;

    shownDelegators = 50;
    columns = ['position', 'address', 'weight'];

    formattedWeight: string;

    constructor(
        public vp: ViewportService,
        public searchService: SearchService,
        private readonly _util: UtilService) {}

    ngOnChanges(): void {
        this.formattedWeight = this._util.numberWithCommas(this.weightSum.toFixed(2));
    }

    getShownDelegators(): Delegator[] {
        if (this.delegators) {
            return this.delegators.slice(0, this.shownDelegators);
        }
        return [];
    }

    increaseShownDelegators(): void {
        this.shownDelegators += 100;
    }
}
