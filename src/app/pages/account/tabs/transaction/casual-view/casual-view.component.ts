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
                <!--
                <div blui-left-content style="justify-content: left; margin-right: 8px; font-size: 0.875rem; font-family: monospace">
                    <span *ngIf="tx.height" style="font-weight: 400; font-family: monospace" class="text-hint">
                        #{{ util.numberWithCommas(tx.height) }}
                    </span>
                </div>
                -->
                <div blui-icon style="margin-right: 8px">
                    <img [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)" loading="lazy" />
                </div>
                <div blui-title>
                    <div class="tag-row">
                        <blui-list-item-tag
                            style="margin-right: 12px"
                            [label]="tx.type || 'receive'"
                            class="type"
                            [class]="txService.createTagClass(tx, isPending)"
                        ></blui-list-item-tag>
                        <span *ngIf="tx.type !== 'change'" class="amount">
                            {{ tx.type === 'receive' || isPending ? '+' : '-' }}
                            {{ util.numberWithCommas(tx.amount) }}
                        </span>

                        <div class="primary" style="font-size: 16px; margin-left: 12px">
                            {{ aliasService.getAlias(tx.address) }}
                        </div>
                    </div>
                    <div class="address-row" style="margin: 4px 0">
                        <a
                            *ngIf="!tx.type || tx.type !== 'change'"
                            class="address link text"
                            [routerLink]="'/' + navItems.account.route + '/' + tx.address"
                            >{{ tx.address }}</a
                        >
                        <a
                            *ngIf="tx.type === 'change'"
                            class="address link text"
                            [routerLink]="'/' + navItems.account.route + '/' + tx.newRepresentative"
                            >{{ aliasService.getAlias(tx.newRepresentative) || tx.newRepresentative }}</a
                        >
                    </div>
                </div>
                <div blui-subtitle class="hash mat-body-2">
                    <span *ngIf="tx.height">
                        <span style="margin-right: 0px">Block #</span>{{ util.numberWithCommas(tx.height) }}
                    </span>
                    <span style="margin: 2px" *ngIf="tx.height">·</span>
                    <a
                        class="link hash text-hint"
                        style="opacity: .7"
                        [routerLink]="'/' + navItems.hash.route + '/' + tx.hash"
                    >
                        {{ tx.hash }}
                    </a>
                </div>
                <div blui-right-content class="right-content" [style.marginRight.px]="vp.sm ? 0 : 8">
                    <div *ngIf="vp.sm" class="small-monkey">
                        <img [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)" loading="lazy" />
                    </div>
                    <div class="timestamps">
                        <span class="mat-body-2">{{ txService.dateMap.get(tx.hash).date }}</span>
                        <span
                            class="mat-body-2 text-secondary"
                            style="margin-top: 0"
                            [style.fontSize.px]="vp.sm ? 12 : 14"
                            (mouseenter)="tx.timestampHovered = true"
                            (mouseleave)="tx.timestampHovered = false"
                        >
                            <ng-container *ngIf="!tx.timestampHovered">
                                {{ txService.dateMap.get(tx.hash).relativeTime }}
                            </ng-container>
                            <ng-container *ngIf="tx.timestampHovered">
                                {{ txService.getTime(tx.timestamp) }}
                            </ng-container>
                        </span>
                    </div>
                </div>
            </blui-info-list-item>
        </mat-list>
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
