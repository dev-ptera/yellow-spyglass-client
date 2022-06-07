import { ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { BlockDto } from '@app/types/dto/BlockDto';
import { UtilService } from '@app/services/util/util.service';
import { SearchService } from '@app/services/search/search.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '@app/services/api/api.service';
import { accountNavItem } from '../../navigation/nav-items';

@Component({
    selector: 'app-hash',
    template: `
        <ng-template #titleContent>
            <div class="app-page-title">
                <span *ngIf="isLoading">Loading</span>
                <span *ngIf="!isLoading">State Block</span>
            </div>
            <div class="app-page-subtitle hash-searched">
                {{ hash }}
                <app-copy-button style="margin-left: 8px" [data]="hash"></app-copy-button>
                <app-bookmark-button [id]="hash"></app-bookmark-button>
            </div>
        </ng-template>

        <ng-template #bodyContent>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Block Account</span>
                    <span class="app-section-subtitle link" (click)="search(block.blockAccount, $event)">
                        {{ block.blockAccount }}
                    </span>
                </div>
                <div class="hash-description text-secondary">The account represented by this state block</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Subtype</span>
                    <span class="app-section-subtitle">{{ block.subtype }}</span>
                </div>
                <div class="hash-description text-secondary">
                    Transaction type; can be "send", "receive", or "change"
                </div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Amount</span>
                    <span class="app-section-subtitle">{{ block.amountRaw }} RAW | {{ block.amount }}</span>
                </div>
                <div class="hash-description text-secondary">Amount of BANANO sent in this transaction</div>
            </div>

            <div class="hash-section" *ngIf="block.subtype !== 'change'">
                <div *ngIf="block.subtype === 'send'">
                    <span class="app-section-title">Recipient</span>
                    <span class="app-section-subtitle link" (click)="search(block.contents.linkAsAccount, $event)">
                        {{ block.contents.linkAsAccount }}
                    </span>
                </div>
                <div *ngIf="block.subtype === 'receive'">
                    <span class="app-section-title">Sender</span>
                    <span class="app-section-subtitle link" (click)="search(block.sourceAccount, $event)">
                        {{ block.sourceAccount }}
                    </span>
                </div>

                <div class="hash-description text-secondary">
                    <ng-container *ngIf="block.subtype === 'send'">
                        The account that is receiving the transaction
                    </ng-container>
                    <ng-container *ngIf="block.subtype === 'receive' || block.subtype === 'open'">
                        The account that sent the transaction
                    </ng-container>
                </div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Balance</span>
                    <span class="app-section-subtitle"
                        >{{ block.balance }} RAW | {{ convertRawToBan(block.balance) }}</span
                    >
                </div>
                <div class="hash-description text-secondary">
                    Block account balance once this transaction is confirmed
                </div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Height</span>
                    <span class="app-section-subtitle">{{ block.height }}</span>
                </div>
                <div class="hash-description text-secondary">Transaction number of this account</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Timestamp</span>
                    <span class="app-section-subtitle">{{ convertUnixToDate(block.timestamp) }}</span>
                </div>
                <div class="hash-description text-secondary">The date and time this block was discovered</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Confirmed</span>
                    <span class="app-section-subtitle">{{ block.confirmed }}</span>
                </div>
                <div class="hash-description text-secondary">Whether or not this block is confirmed</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Representative</span>
                    <span class="app-section-subtitle link" (click)="search(block.contents.representative, $event)">{{
                        block.contents.representative
                    }}</span>
                </div>
                <div class="hash-description text-secondary">The account's representative</div>
            </div>
            <div class="hash-section" *ngIf="block.subtype !== 'change'">
                <div>
                    <span class="app-section-title">Previous Block</span>
                    <span
                        class="app-section-subtitle"
                        [class.link]="block.height !== 1"
                        (click)="search(block.contents.previous, $event)"
                    >
                        {{ block.height === 1 ? 'This block opened the account' : block.contents.previous }}</span
                    >
                </div>
                <div class="hash-description text-secondary">The previous block in this account's chain</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Link</span>
                    <span class="app-section-subtitle link" (click)="search(block.contents.link, $event)">{{
                        block.contents.link
                    }}</span>
                </div>
                <div class="hash-description text-secondary">The corresponding block that started this transaction</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Signature</span>
                    <span class="app-section-subtitle">{{ block.contents.signature }}</span>
                </div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="app-section-title">Work</span>
                    <span class="app-section-subtitle">{{ block.contents.work }}</span>
                </div>
            </div>
        </ng-template>

        <div class="hash-root app-page-root" responsive>
            <div class="app-page-content">
                <app-error *ngIf="hashError"></app-error>
                <ng-container *ngIf="!hashError">
                    <ng-template [ngTemplateOutlet]="titleContent"></ng-template>
                    <div *ngIf="!isLoading" class="animation-body network-container">
                        <ng-template [ngTemplateOutlet]="bodyContent"></ng-template>
                    </div>
                </ng-container>
            </div>
        </div>
    `,
    styleUrls: ['./hash.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HashComponent implements OnDestroy {
    hash: string;
    block: BlockDto;
    isLoading: boolean;
    hashError: boolean;

    routeListener: Subscription;

    constructor(
        public vp: ViewportService,
        private readonly _router: Router,
        private readonly _apiService: ApiService,
        private readonly _util: UtilService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _searchService: SearchService
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

    private _searchHash(hash: string): void {
        this.hash = hash;
        this.block = undefined;
        this.isLoading = true;
        this.hashError = false;

        if (!hash) {
            return;
        }

        if (hash.startsWith('ban_')) {
            return this._redirectToAddressPage(hash);
        }

        this._apiService
            .fetchBlock(hash)
            .then((blockResponse) => {
                this.block = blockResponse;
            })
            .catch((err) => {
                console.error(err);
                this.hashError = true;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    /** Call this method whenever someone has accidently routed to the hash page, but with an address. */
    private _redirectToAddressPage(address: string): void {
        void this._router.navigate([`/${accountNavItem.route}/${address}`]);
    }

    convertRawToBan(raw: string): string {
        return `${this._util.convertRawToBan(raw, {
            precision: 10,
            comma: true,
        })} BAN`;
    }

    convertUnixToDate(time: number): string {
        return `${new Date(time * 1000).toLocaleDateString()} ${new Date(time * 1000).toLocaleTimeString()}`;
    }

    search(value: string, e: MouseEvent): void {
        if (value !== '0000000000000000000000000000000000000000000000000000000000000000') {
            this._searchService.emitSearch(value, e.ctrlKey);
        }
    }
}
