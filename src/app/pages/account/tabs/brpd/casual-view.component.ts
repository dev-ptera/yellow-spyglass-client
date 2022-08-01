import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from "@angular/core";
import {Transaction, TransactionsService} from "@app/services/transactions/transactions.service";
import {UtilService} from "@app/services/util/util.service";
import {ViewportService} from "@app/services/viewport/viewport.service";
import {ApiService} from "@app/services/api/api.service";
import {AliasService} from "@app/services/alias/alias.service";

@Component({
    selector: 'casual-view-row',
    template: `
        <blui-info-list-item
            [divider]="last ? undefined : 'full'"
            [wrapTitle]="true"
            [wrapSubtitle]="false"
            [hidePadding]="true"
            style="position: relative"
        >
            <div blui-icon>
                <img
                    [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)"
                    loading="lazy"
                    style="margin-right: 8px"
                />
            </div>
            <div blui-left-content [style.width.px]="vp.sm ? 64 : 72" style="justify-content: left">
                <blui-list-item-tag
                    [label]="tx.type || 'receive'"
                    class="type"
                    [class]="txService.createTagClass(tx, isPending)"
                ></blui-list-item-tag>
            </div>
            <div blui-title>
                <div class="tag-row">
                <span *ngIf="tx.type !== 'change'" class="amount">
                    {{ tx.type === 'receive' || isPending ? '+' : '-' }}
                    {{ util.numberWithCommas(tx.amount) }}
                </span>
                </div>
                <div class="address-row">
                    <ng-container *ngIf="!tx.type || tx.type === 'receive'">
                        <span class="to-from text-secondary">from</span>
                        <span>
                        <a class="address link text" [routerLink]="'/' + navItems.account.route + '/' + tx.address">{{
                            aliasService.getAlias(tx.address) || tx.address
                            }}</a>
                    </span>
                    </ng-container>

                    <ng-container *ngIf="tx.type === 'send'">
                        <span class="to-from text-secondary">to</span>
                        <span>
                        <a class="address link text" [routerLink]="'/' + navItems.account.route + '/' + tx.address"
                        >{{ aliasService.getAlias(tx.address) || tx.address }}
                        </a>
                    </span>
                    </ng-container>

                    <ng-container *ngIf="tx.type === 'change'">
                        <span class="to-from text-secondary">to</span>
                        <span
                        ><a
                            class="address link text"
                            [routerLink]="'/' + navItems.account.route + '/' + tx.newRepresentative"
                        >{{ aliasService.getAlias(tx.newRepresentative) || tx.newRepresentative }}</a
                        >
                    </span>
                    </ng-container>
                </div>
            </div>
            <div blui-subtitle class="hash text-hint mat-body-2">
            <span *ngIf="tx.height">
                <span style="margin-right: 0px">#</span>{{ util.numberWithCommas(tx.height) }}</span
            >
                <span style="margin: 0 4px" *ngIf="tx.height">·</span>
                <a class="link hash text-hint" [routerLink]="'/' + navItems.hash.route + '/' + tx.hash">{{ tx.hash }} </a>
            </div>
            <div blui-right-content class="right-content" [style.marginRight.px]="vp.sm ? 0 : 8">
                <div *ngIf="vp.sm" class="small-monkey">
                    <img [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)" loading="lazy" />
                </div>
                <div class="timestamps">
                    <span class="mat-body-2">{{ txService.dateMap.get(tx.hash).date }}</span>
                    <span
                        class="mat-body-2 text-secondary"
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
    `,
    encapsulation: ViewEncapsulation.None,
})
export class CasualViewComponent {
    @Input() tx: Transaction;
    @Input() isPending: boolean;
    @Input() last: boolean;
    @Input() navItems: any;

    constructor(
        public util: UtilService,
        public vp: ViewportService,
        public apiService: ApiService,
        public aliasService: AliasService,
        public txService: TransactionsService
    ) {}
}
