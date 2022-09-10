import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Transaction, TransactionsService } from '@app/services/transactions/transactions.service';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { AliasService } from '@app/services/alias/alias.service';
import { APP_NAV_ITEMS } from '../../../../../navigation/nav-items';

@Component({
    selector: 'app-casual-view',
    styleUrls: [`casual-view.component.scss`],
    encapsulation: ViewEncapsulation.None,
    template: `
        <mat-list class="tab-transaction-list" responsive>
            <blui-info-list-item
                *ngFor="let tx of transactions; trackBy: trackByFn; let last = last"
                [divider]="last ? undefined : 'full'"
                [wrapTitle]="true"
                [wrapSubtitle]="false"
                [hidePadding]="true"
                style="position: relative"
            >
                <div blui-icon style="margin-right: 8px" *ngIf="!vp.sm">
                    <img [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)" loading="lazy" />
                </div>
                <div blui-title>
                    <div class="tag-row">
                        <blui-list-item-tag
                            [label]="tx.type || 'Receivable'"
                            class="type"
                            [class]="txService.createTagClass(tx, isPending)"
                        ></blui-list-item-tag>

                        <span *ngIf="tx.type !== 'change'" class="amount">
                            {{ tx.type === 'receive' || tx.type === 'open' || isPending ? '+' : '-' }}
                            {{ tx.amount | appComma }}
                        </span>

                        <div class="primary" *ngIf="!vp.sm" style="font-size: 1rem">
                            {{ aliasService.getAlias(tx.address) }}
                        </div>
                    </div>
                    <div class="address-row">
                        <div
                            class="primary"
                            *ngIf="vp.sm && aliasService.has(tx.address)"
                            style="font-size: 0.875rem; margin: 12px 0 8px 0"
                        >
                            {{ aliasService.getAlias(tx.address) }}
                        </div>
                        <a
                            *ngIf="!tx.type || tx.type !== 'change'"
                            class="address link text"
                            [routerLink]="'/' + navItems.account.route + '/' + tx.address"
                            [innerHTML]="tx.address | colorAddress"
                        ></a>
                        <a
                            *ngIf="tx.type === 'change'"
                            class="address link text"
                            [routerLink]="'/' + navItems.account.route + '/' + tx.newRepresentative"
                            [innerHTML]="tx.newRepresentative | colorAddress"
                        ></a>
                    </div>
                </div>

                <div blui-subtitle class="hash mat-body-2" *ngIf="vp.sm">
                    <ng-template *ngTemplateOutlet="hash; context: { tx: tx }"></ng-template>
                </div>

                <div blui-right-content class="right-content" [style.marginRight.px]="vp.sm ? 0 : 8">
                    <div *ngIf="!vp.sm">
                        <ng-template *ngTemplateOutlet="hash; context: { tx: tx }"></ng-template>
                    </div>

                    <div *ngIf="vp.sm" class="small-monkey">
                        <img [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)" loading="lazy" />
                    </div>

                    <div class="timestamps" [style.minWidth.px]="vp.sm ? 0 : 150">
                        <div>
                            {{ txService.dateMap.get(tx.hash).date }}
                        </div>
                        <div
                            class="text-hint"
                            style="margin-top: 0; display: flex; align-items: center; justify-content: flex-end"
                            [style.fontSize.px]="vp.sm ? 12 : 14"
                            (mouseenter)="tx.timestampHovered = true"
                            (mouseleave)="tx.timestampHovered = false"
                        >
                            <mat-icon *ngIf="!vp.sm" class="text-secondary meta-icon" style="margin-right: 4px"
                                >schedule
                            </mat-icon>
                            <ng-container *ngIf="!tx.timestampHovered">
                                {{ txService.dateMap.get(tx.hash).relativeTime }}
                            </ng-container>
                            <ng-container *ngIf="tx.timestampHovered">
                                {{ txService.getTime(tx.timestamp) }}
                            </ng-container>
                        </div>
                    </div>
                </div>
            </blui-info-list-item>
        </mat-list>

        <ng-template #hash let-tx="tx">
            <div
                class="block-info"
                [style.flexDirection]="vp.sm ? 'row' : 'column'"
                [style.alignItems]="vp.sm ? 'center' : ''"
            >
                <div *ngIf="tx.height">
                    <span style="margin-right: 4px">Block No.</span>{{ util.numberWithCommas(tx.height) }}
                </div>
                <div style="margin: 0 12px" *ngIf="tx.height && vp.sm">·</div>
                <div style="display: flex; align-items: center">
                    <mat-icon class="text-secondary meta-icon" style="margin-right: 4px"> receipt</mat-icon>
                    <a
                        class="link text-hint"
                        style="font-family: monospace"
                        [routerLink]="'/' + navItems.hash.route + '/' + tx.hash"
                    >
                        {{ tx.hash?.substring(0, 8) }}...
                    </a>
                </div>
            </div>
        </ng-template>
    `,
})
export class CasualViewComponent {
    @Input() transactions: Transaction[];
    @Input() isPending: boolean;
    navItems = APP_NAV_ITEMS;

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService
    ) {}

    trackByFn(index: number, tx: Transaction): number {
        return index;
    }
}
