import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { Block } from '@app/types/dto/BlockDto';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '@app/services/api/api.service';
import { accountNavItem, APP_NAV_ITEMS } from '../../navigation/nav-items';
import { AliasService } from '@app/services/alias/alias.service';

@Component({
    selector: 'app-hash',
    template: `
        <ng-template #alias let-address="address">
            <div *ngIf="getAlias(address) as alias">
                <mat-icon class="text-secondary" style="margin-right: 8px; font-size: 18px; height: 18px; width: 18px"
                    >account_circle</mat-icon
                >
                <span>{{ alias }}</span>
            </div>
        </ng-template>

        <ng-template #titleContent let-t="t">
            <div class="app-page-title" style="display: flex; align-items: center">
                <div>State Block</div>
                <app-load-spinner *ngIf="isLoading"></app-load-spinner>
            </div>
            <div class="app-page-subtitle hash-searched">
                {{ hash }}
                <app-copy-button style="margin-left: 8px" [data]="hash"></app-copy-button>
                <app-bookmark-button [id]="hash"></app-bookmark-button>
            </div>
        </ng-template>

        <ng-template #bodyContent let-t="t">
            <div class="hash-section">
                <div class="alias-row">
                    <div>
                        <span class="app-section-title">{{ t('blockAccount.title') }}</span>
                        <a
                            class="mat-body-1 link text"
                            [routerLink]="'/' + routes.account.route + '/' + block.block_account"
                        >
                            {{ block.block_account }}
                        </a>
                    </div>
                    <ng-container *ngTemplateOutlet="alias; context: { address: block.block_account }"></ng-container>
                </div>
                <div class="hash-description text-secondary">{{ t('blockAccount.description') }}</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">{{ t('subtype.title') }}</span>
                    <span class="mat-body-1">{{ block.subtype }}</span>
                </div>
                <div class="hash-description text-secondary">{{ t('subtype.description') }}</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">{{ t('amount.title') }}</span>
                    <span class="mat-body-1">
                        <span [innerHTML]="block.amount_decimal | appComma | appLittleDecimal"></span> BAN |
                        {{ block.amount }} RAW
                    </span>
                </div>
                <div class="hash-description text-secondary">{{ t('amount.description') }}</div>
            </div>

            <div class="hash-section" *ngIf="block.subtype === 'receive'">
                <div class="alias-row">
                    <div>
                        <span class="app-section-title">{{ t('sender.title') }}</span>
                        <a
                            class="mat-body-1 link text"
                            [routerLink]="'/' + routes.account.route + '/' + block.source_account"
                        >
                            {{ block.source_account }}
                        </a>
                    </div>
                    <ng-container *ngTemplateOutlet="alias; context: { address: block.source_account }"></ng-container>
                </div>
                <div class="hash-description text-secondary">{{ t('sender.description') }}</div>
            </div>

            <div class="hash-section" *ngIf="block.subtype === 'send'">
                <div class="alias-row">
                    <div>
                        <span class="app-section-title">{{ t('recipient.title') }}</span>
                        <a
                            class="mat-body-1 link text"
                            [routerLink]="'/' + routes.account.route + '/' + block.contents.link_as_account"
                        >
                            {{ block.contents.link_as_account }}
                        </a>
                    </div>
                    <ng-container
                        *ngTemplateOutlet="alias; context: { address: block.contents.link_as_account }"
                    ></ng-container>
                </div>
                <div class="hash-description text-secondary">{{ t('recipient.description') }}</div>
            </div>

            <div class="hash-section">
                <div>
                    <span class="app-section-title">{{ t('balance.title') }}</span>
                    <span class="mat-body-1">
                        <span [innerHTML]="block.balance_decimal | appComma | appLittleDecimal"></span> BAN |
                        {{ block.balance }} RAW
                    </span>
                </div>
                <div class="hash-description text-secondary">{{ t('balance.description') }}</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">{{ t('height.title') }}</span>
                    <span class="mat-body-1">{{ block.height | appComma }}</span>
                </div>
                <div class="hash-description text-secondary">{{ t('height.description') }}</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">{{ t('timestamp.title') }}</span>
                    <span class="mat-body-1">{{ convertUnixToDate(block.local_timestamp) }}</span>
                </div>
                <div class="hash-description text-secondary">{{ t('timestamp.description') }}</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">{{ t('confirmed.title') }}</span>
                    <span class="mat-body-1">{{ block.confirmed }}</span>
                </div>
                <div class="hash-description text-secondary">{{ t('confirmed.description') }}</div>
            </div>
            <div class="hash-section">
                <div class="alias-row">
                    <div>
                        <span class="app-section-title">{{ t('representative.title') }}</span>
                        <a
                            class="mat-body-1 link text"
                            [routerLink]="'/' + routes.account.route + '/' + block.contents.representative"
                        >
                            {{ block.contents.representative }}
                        </a>
                    </div>
                    <ng-container
                        *ngTemplateOutlet="alias; context: { address: block.contents.representative }"
                    ></ng-container>
                </div>
                <div class="hash-description text-secondary">{{ t('representative.description') }}</div>
            </div>
            <div
                class="hash-section"
                *ngIf="
                    block.successor &&
                    block.successor !== '0000000000000000000000000000000000000000000000000000000000000000'
                "
            >
                <div>
                    <span class="app-section-title">{{ t('nextBlock.title') }}</span>
                    <a class="mat-body-1 text link" [routerLink]="'/' + routes.hash.route + '/' + block.successor">
                        {{ block.successor }}
                    </a>
                </div>
                <div class="hash-description text-secondary">{{ t('nextBlock.description') }}</div>
            </div>
            <div class="hash-section" *ngIf="block.height !== '1'">
                <div>
                    <span class="app-section-title">{{ t('prevBlock.title') }}</span>
                    <a
                        class="mat-body-1 text link"
                        [routerLink]="'/' + routes.hash.route + '/' + block.contents.previous"
                        >{{ block.contents.previous }}</a
                    >
                </div>
                <div class="hash-description text-secondary">{{ t('prevBlock.description') }}</div>
            </div>
            <div class="hash-section" *ngIf="block.subtype === 'receive'">
                <div>
                    <span class="app-section-title">{{ t('link.title') }}</span>
                    <a class="mat-body-1 link text" [routerLink]="'/' + routes.hash.route + '/' + block.contents.link">
                        {{ block.contents.link }}
                    </a>
                </div>
                <div class="hash-description text-secondary">{{ t('link.description') }}</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">{{ t('sig.title') }}</span>
                    <span class="mat-body-1">{{ block.contents.signature }}</span>
                </div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">{{ t('work.title') }}</span>
                    <span class="mat-body-1">{{ block.contents.work }}</span>
                </div>
            </div>

            <div class="hash-section">
                <span class="app-section-title">{{ t('originalBlock.title') }}</span>
                <pre class="original-block-content mono">{{ block | json }}</pre>
            </div>
        </ng-template>

        <ng-container *transloco="let t; scope: 'block'; read: 'block'">
            <div class="hash-root app-page-root" responsive [style.justifyContent.center]="hasError">
                <div class="app-page-content">
                    <div *ngIf="hasError" style="display: flex; justify-content: center;">
                        <blui-empty-state
                            style="max-width: 420px; margin-top: 64px"
                            [title]="t('unknownBlock.title')"
                            [description]="t('unknownBlock.description')"
                        >
                            <button blui-actions mat-flat-button color="primary" (click)="goBack()">
                                {{ t('unknownBlock.buttonText') }}
                            </button>
                            <mat-icon blui-empty-icon>info</mat-icon>
                        </blui-empty-state>
                    </div>
                    <ng-container *ngIf="!hasError">
                        <ng-template [ngTemplateOutlet]="titleContent" [ngTemplateOutletContext]="{ t }"></ng-template>
                        <div *ngIf="!isLoading" class="animation-body network-container">
                            <ng-template
                                [ngTemplateOutlet]="bodyContent"
                                [ngTemplateOutletContext]="{ t }"
                            ></ng-template>
                        </div>
                    </ng-container>
                </div>
            </div>
        </ng-container>
    `,
    styleUrls: ['./block.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BlockComponent implements OnDestroy {
    hash: string;
    block: Block;
    isLoading: boolean;
    hasError: boolean;

    routes = APP_NAV_ITEMS;
    routeListener: Subscription;

    constructor(
        public vp: ViewportService,
        private readonly _router: Router,
        private readonly _apiService: ApiService,
        private readonly _aliasService: AliasService
    ) {
        this.routeListener = this._router.events.subscribe((route) => {
            if (route instanceof NavigationEnd) {
                const splitUrl = this._router.url.split('/');
                this._searchHash(splitUrl[splitUrl.length - 1]);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.routeListener) {
            this.routeListener.unsubscribe();
        }
    }

    goBack(): void {
        window.history.back();
    }

    private _searchHash(hash: string): void {
        this.hash = hash;
        this.block = undefined;
        this.isLoading = true;
        this.hasError = false;

        if (!hash) {
            return;
        }

        if (hash.startsWith('ban_')) {
            return this._redirectToAddressPage(hash);
        }

        this._apiService
            .fetchBlock(hash)
            .then((blockResponse) => {
                this.block = blockResponse.blocks[hash];
            })
            .catch((err) => {
                console.error(err);
                this.hasError = true;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    /** Call this method whenever someone has accidently routed to the hash page, but with an address. */
    private _redirectToAddressPage(address: string): void {
        void this._router.navigate([`/${accountNavItem.route}/${address}`], { replaceUrl: true });
    }

    convertUnixToDate(time: string): string {
        const ts = Number(time);
        if (ts === 0) {
            return 'Unknown';
        }

        return `${new Date(ts * 1000).toLocaleDateString()} ${new Date(ts * 1000).toLocaleTimeString()}`;
    }

    getAlias(address: string): string {
        return this._aliasService.getAlias(address);
    }
}
