import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Delegator } from '@app/types/modal/Delegator';

@Component({
    selector: 'account-delegators-tab',
    template: `
        <table
            mat-table
            *ngIf="delegators.length > 0"
            [style.width.%]="100"
            [dataSource]="getShownDelegators()"
            class="mat-elevation-z4"
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
                    (click)="search.emit(element.address)"
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
        <div *ngIf="delegators.length > 0" style="text-align: center; margin-top: 8px; font-size: 10px">
            *Accounts with a 0 BANANO balance have been removed from the total delegators count.
        </div>
        <div style="text-align: center; margin-top: 16px" *ngIf="delegators.length > shownDelegators">
            <button color="primary" style="padding: 8px 16px" mat-stroked-button (click)="increaseShownDelegators()">
                Load more
            </button>
        </div>

        <pxb-empty-state
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
export class DelegatorsTabComponent {
    @Input() delegators: Delegator[];
    @Output() search: EventEmitter<string> = new EventEmitter<string>();

    shownDelegators = 50;
    columns = ['position', 'address', 'weight'];

    getShownDelegators(): Delegator[] {
        if (this.delegators) {
            return this.delegators.slice(0, this.shownDelegators);
        } else {
            return [];
        }
    }

    increaseShownDelegators(): void {
        this.shownDelegators += 100;
    }
}
