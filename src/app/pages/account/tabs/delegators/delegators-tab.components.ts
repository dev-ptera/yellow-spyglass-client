import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    ViewEncapsulation,
} from '@angular/core';
import { Delegator } from '@app/types/modal/Delegator';
import { SearchService } from '@app/services/search/search.service';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { environment } from 'environments/environment';
import { MegaphoneService } from '@app/services/megaphone/megaphone.service';

@Component({
    selector: 'account-delegators-tab',
    template: `
        <div class="account-delegator-weight" *ngIf="weightSum !== 0">
            <span class="account-delegator-weight-sum" responsive>{{ formattedWeight }}</span>
            <span class="account-delegator-weight-sum-description" responsive>BAN Delegated Weight</span>
            <ng-container *ngIf="isMegaphone">
                <blui-spacer></blui-spacer>
                <button
                    mat-flat-button
                    color="primary"
                    (click)="toot()"
                    style="margin-right: 24px"
                    [disabled]="megaSuccess"
                >
                    <ng-container *ngIf="!megaSuccess">Use Megaphone</ng-container>
                    <ng-container *ngIf="megaSuccess">All is Good</ng-container>
                </button>
            </ng-container>
        </div>
        <table mat-table *ngIf="delegators.length > 0" [style.width.%]="100" [dataSource]="getShownDelegators()">
            <ng-container matColumnDef="position">
                <th mat-header-cell *matHeaderCellDef mat-sort-header></th>
                <td mat-cell [style.paddingRight.px]="16" *matCellDef="let element; let i = index">#{{ i + 1 }}</td>
            </ng-container>

            <ng-container matColumnDef="megaphone">
                <th mat-header-cell *matHeaderCellDef mat-sort-header></th>
                <td mat-cell *matCellDef="let element">
                    <div style="display: flex" *ngIf="!megaphone.hasAddress(element.address)">
                        <button
                            mat-stroked-button
                            color="accent"
                            (click)="megaphone.addAddress(element.address, 1)"
                            [style.marginRight.px]="8"
                        >
                            Offline
                        </button>
                        <button
                            mat-stroked-button
                            color="accent"
                            (click)="megaphone.addAddress(element.address, 2)"
                            [style.marginRight.px]="16"
                        >
                            Large
                        </button>
                    </div>
                    <ng-container *ngIf="megaphone.hasAddress(element.address)">
                        <button mat-stroked-button color="warn" (click)="megaphone.removeAddress(element.address)">
                            Exclude
                        </button>
                    </ng-container>
                </td>
            </ng-container>

            <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Address</th>
                <td
                    mat-cell
                    [style.paddingTop.px]="8"
                    [style.paddingBottom.px]="8"
                    class="account-delegator-address-cell"
                    *matCellDef="let element"
                    (click)="searchService.emitSearch(element.address, $event.ctrlKey)"
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
        <div
            *ngIf="delegators.length > 0"
            [style.paddingLeft.px]="16"
            [style.fontSize.px]="vp.sm ? 10 : 14"
            style="margin: 16px 0;"
        >
            *Accounts with a 0 BANANO balance have been removed from the total delegators count.
        </div>
        <div style="text-align: center; margin: 16px 0" *ngIf="delegators.length > shownDelegators">
            <button color="primary" style="padding: 8px 16px" mat-stroked-button (click)="increaseShownDelegators()">
                Load more
            </button>
        </div>

        <blui-empty-state
            responsive
            *ngIf="delegators.length === 0"
            class="account-empty-state"
            title="No Delegators"
            description="This account has no delegated weight.  If this account is not running a node, this is a good thing."
        >
            <mat-icon blui-empty-icon>how_to_vote</mat-icon>
        </blui-empty-state>
    `,
    styleUrls: ['delegators-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DelegatorsTabComponent implements OnChanges {
    @Input() delegators: Delegator[];
    @Input() weightSum: number;

    shownDelegators = 50;
    isMegaphone = environment.megaphone;
    columns = this.isMegaphone ? ['position', 'megaphone', 'address', 'weight'] : ['position', 'address', 'weight'];

    formattedWeight: string;
    megaSuccess: boolean;

    constructor(
        public vp: ViewportService,
        public searchService: SearchService,
        public megaphone: MegaphoneService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _util: UtilService
    ) {}

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

    toot(): void {
        this.megaphone
            .toot()
            .then(() => {
                this.megaSuccess = true;
                this.megaphone.reset();
                this._ref.detectChanges();
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
