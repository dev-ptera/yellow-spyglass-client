import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Transaction, TransactionsService } from '@app/services/transactions/transactions.service';
import { UtilService } from '@app/services/util/util.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { AliasService } from '@app/services/alias/alias.service';
import { APP_NAV_ITEMS } from '../../../../../navigation/nav-items';

@Component({
    selector: 'app-compact-view',
    styleUrls: [`compact-view.component.scss`],
    encapsulation: ViewEncapsulation.None,
    template: `
        <div
            *ngFor="let tx of transactions; trackBy: trackByFn; let last = last"
            class="animation-content brpd-tab-transaction-list"
        >
            <div style="display: flex; align-items: center">
                <img
                    [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)"
                    loading="lazy"
                    style="height: 50px; width: 50px; margin-right: 12px"
                />
                <a
                    *ngIf="tx.height"
                    [routerLink]="'/' + navItems.hash.route + '/' + tx.hash"
                    class="link text mono"
                    style="margin-right: 24px"
                >
                    <span style="margin-right: 0px" style="font-size: 14px">#</span
                    >{{ util.numberWithCommas(tx.height) }}
                </a>

                <blui-list-item-tag
                    style="margin-right: 24px; width: 68px; text-align: center"
                    [label]="tx.type || 'receive'"
                    class="type"
                    [class]="txService.createTagClass(tx, isPending)"
                ></blui-list-item-tag>

                <div
                    class="amount"
                    [class.primary]="tx.type === 'receive'"
                    [class.warn]="tx.type === 'send'"
                    style="width: 220px"
                >
                    <ng-container *ngIf="tx.type !== 'change'">
                        {{ tx.type === 'receive' || isPending ? '+' : '-' }}
                        {{ formatNumber(tx.amount) }}
                    </ng-container>
                </div>
                <div
                    style="margin-right: 24px"
                    (mouseenter)="tx.hoverAddress = true"
                    (mouseleave)="tx.hoverAddress = false"
                >
                    <button
                        mat-icon-button
                        *ngIf="tx.hoverAddress"
                        (click)="copyAddress(tx)"
                        style="cursor: pointer; height: 24px; width: 24px; margin-right: 4px; line-height: 24px"
                    >
                        <mat-icon style="font-size: 16px">
                            {{ tx.showCopiedAddressIcon ? 'check_circle' : 'copy_all' }}
                        </mat-icon>
                    </button>
                    <a
                        style="font-size: 14px"
                        class="link text mono"
                        [routerLink]="'/' + navItems.account.route + '/' + (tx.address || tx.newRepresentative)"
                        >{{ util.shortenAddress(tx.address || tx.newRepresentative) }}
                    </a>
                </div>

                <!-- JUNGLE TV -->
                <img
                    *ngIf="aliasService.getSocialMedia(tx.address || tx.newRepresentative) === 'jungletv'"
                    src="assets/social-media/jtv.png"
                    class="social-media-icon"
                    style="margin-right: 8px"
                />

                <!-- Twitter -->
                <button
                    mat-icon-button
                    class="social-media-button"
                    *ngIf="aliasService.getSocialMedia(tx.address || tx.newRepresentative) === 'twitter'"
                    (click)="copyPlatformUserId(tx)"
                >
                    <img
                        *ngIf="!tx.showCopiedPlatformIdIcon"
                        src="assets/social-media/twitter.svg"
                        class="social-media-icon"
                    />
                    <mat-icon style="font-size: 16px" *ngIf="tx.showCopiedPlatformIdIcon">check_circle</mat-icon>
                </button>

                <!-- Discord -->
                <button
                    mat-icon-button
                    class="social-media-button"
                    *ngIf="aliasService.getSocialMedia(tx.address || tx.newRepresentative) === 'discord'"
                    (click)="copyPlatformUserId(tx)"
                >
                    <img
                        *ngIf="!tx.showCopiedPlatformIdIcon"
                        src="assets/social-media/discord.svg"
                        class="social-media-icon"
                    />
                    <mat-icon style="font-size: 16px" *ngIf="tx.showCopiedPlatformIdIcon">check_circle</mat-icon>
                </button>

                <!-- Telegram -->
                <button
                    mat-icon-button
                    class="social-media-button"
                    *ngIf="aliasService.getSocialMedia(tx.address || tx.newRepresentative) === 'telegram'"
                    (click)="copyPlatformUserId(tx)"
                >
                    <img
                        *ngIf="!tx.showCopiedPlatformIdIcon"
                        src="assets/social-media/telegram.svg"
                        class="social-media-icon"
                    />
                    <mat-icon style="font-size: 16px" *ngIf="tx.showCopiedPlatformIdIcon">check_circle</mat-icon>
                </button>

                <a
                    style="font-weight: 600; font-size: 14px"
                    class="link text primary"
                    *ngIf="hasNickname(tx.address || tx.newRepresentative)"
                    [routerLink]="'/' + navItems.account.route + '/' + (tx.address || tx.newRepresentative)"
                >
                    <ng-container *ngIf="aliasService.getSocialMedia(tx.address || tx.newRepresentative) === 'discord'">
                        ID:
                    </ng-container>

                    {{ aliasService.getAlias(tx.address || tx.newRepresentative) }}

                    <!--
                    <ng-container *ngIf="aliasService.getSocialMedia(tx.address || tx.newRepresentative) === 'discord'">#????</ng-container>
                    -->
                </a>
                <blui-spacer></blui-spacer>
                <div style="margin-right: 12px">
                    <div style="display: flex; flex-direction: column; align-items: end">
                        <span class="mat-body-2" style="margin-bottom: -4px">
                            {{ txService.dateMap.get(tx.hash).date }}
                        </span>
                        <span
                            class="mat-body-2 text-secondary"
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
            </div>
            <mat-divider *ngIf="!last" style="bottom: 1px"></mat-divider>
            <div class="invisible-full-address">
                {{ tx.address }}
            </div>
        </div>
    `,
})
export class CompactViewComponent {
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

    trackByFn(index: number): number {
        return index;
    }

    copyAddress(item: Transaction): void {
        void navigator.clipboard.writeText(item.address || item.newRepresentative);
        item.showCopiedAddressIcon = true;
        setTimeout(() => {
            item.showCopiedAddressIcon = false;
        }, 700);
    }

    copyPlatformUserId(item: Transaction): void {
        const discordId = this.aliasService.getSocialMediaUserId(item.address || item.newRepresentative);
        void navigator.clipboard.writeText(String(discordId));
        item.showCopiedPlatformIdIcon = true;
        setTimeout(() => {
            item.showCopiedPlatformIdIcon = false;
        }, 700);
    }

    hasNickname(address: string): boolean {
        return this.aliasService.has(address);
    }

    formatNumber(x: number): string {
        if (isNaN(x)) {
            return;
        }
        return this.util.numberWithCommas(Number(x.toFixed(4)));
    }
}
