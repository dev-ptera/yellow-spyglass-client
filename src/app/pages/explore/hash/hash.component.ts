import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { BlockDto } from '@app/types/dto/BlockDto';
import { UtilService } from '@app/services/util/util.service';
import { SearchService } from '@app/services/search/search.service';

@Component({
    selector: 'app-hash',
    template: `
        <ng-template #titleContent>
            <div [class.mat-display-2]="!vp.sm" [class.mat-display-1]="vp.sm" [style.marginBottom.px]="8">
                <span *ngIf="loading">Loading</span>
                <span *ngIf="!loading">State Block</span>
            </div>
            <div class="mat-subheading-2 hash-searched">
                {{ hash }}
                <app-copy-button [data]="hash"></app-copy-button>
                <app-bookmark-button [id]="hash"></app-bookmark-button>
            </div>
        </ng-template>

        <ng-template #bodyContent>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Block Account</span>
                    <span class="mat-subheading-2 hash-link" (click)="search(block.blockAccount)">
                        {{ block.blockAccount }}
                    </span>
                </div>
                <div class="hash-description">The account represented by this state block</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Subtype</span>
                    <span class="mat-subheading-2">{{ block.subtype }}</span>
                </div>
                <div class="hash-description">Transaction type; can be "send", "receive", or "change"</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Amount</span>
                    <span class="mat-subheading-2">{{ block.amount }} RAW | {{ convertRawToBan(block.amount) }}</span>
                </div>
                <div class="hash-description">Amount of BANANO sent in this transaction</div>
            </div>

            <div class="hash-section" *ngIf="block.subtype !== 'change'">
                <div *ngIf="block.subtype === 'send'">
                    <span class="mat-headline">Recipient</span>
                    <span class="mat-subheading-2 hash-link" (click)="search(block.contents.linkAsAccount)">{{
                        block.contents.linkAsAccount
                    }}</span>
                </div>
                <div *ngIf="block.subtype === 'receive'">
                    <span class="mat-headline">Sender</span>
                    <span class="mat-subheading-2 hash-link" (click)="search(block.sourceAccount)">{{
                        block.sourceAccount
                        }}</span>
                </div>

                <div class="hash-description">
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
                    <span class="mat-headline">Balance</span>
                    <span class="mat-subheading-2">{{ block.balance }} RAW | {{ convertRawToBan(block.balance) }}</span>
                </div>
                <div class="hash-description">Block account balance once this transaction is confirmed</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Height</span>
                    <span class="mat-subheading-2">{{ block.height }}</span>
                </div>
                <div class="hash-description">Transaction number of this account</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Timestamp</span>
                    <span class="mat-subheading-2">{{ block.timestamp }}</span>
                </div>
                <div class="hash-description">The date and time this block was discovered</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Confirmed</span>
                    <span class="mat-subheading-2">{{ block.confirmed }}</span>
                </div>
                <div class="hash-description">Whether or not this block is confirmed</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Representative</span>
                    <span class="mat-subheading-2 hash-link" (click)="search(block.contents.representative)">{{
                        block.contents.representative
                    }}</span>
                </div>
                <div class="hash-description">The account's representative</div>
            </div>
            <div class="hash-section" *ngIf="block.subtype !== 'change'">
                <div>
                    <span class="mat-headline">Previous Block</span>
                    <span class="mat-subheading-2 hash-link" (click)="search(block.contents.previous)">
                        {{ block.height === 1 ? 'This block opened the account' : block.contents.previous }}</span
                    >
                </div>
                <div class="hash-description">The previous block in this account's chain</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Link</span>
                    <span class="mat-subheading-2 hash-link" (click)="search(block.contents.link)">{{
                        block.contents.link
                    }}</span>
                </div>
                <div class="hash-description">The corresponding block that started this transaction</div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Signature</span>
                    <span class="mat-subheading-2">{{ block.contents.signature }}</span>
                </div>
            </div>
            <div class="hash-section">
                <div>
                    <span class="mat-headline">Work</span>
                    <span class="mat-subheading-2">{{ block.contents.work }}</span>
                </div>
            </div>
        </ng-template>

        <app-error *ngIf="error"></app-error>
        <ng-container *ngIf="!error">
            <ng-template [ngTemplateOutlet]="titleContent"></ng-template>
            <ng-template *ngIf="!loading" [ngTemplateOutlet]="bodyContent"></ng-template>
        </ng-container>
    `,
    styleUrls: ['./hash.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HashComponent {
    @Input() hash: string;
    @Input() block: BlockDto;
    @Input() loading: boolean;
    @Input() error: boolean;

    constructor(
        public vp: ViewportService,
        private readonly _util: UtilService,
        private readonly _searchService: SearchService
    ) {}

    convertRawToBan(raw: string): string {
        return `${this._util.convertRawToBan(raw, {
            precision: 10,
            comma: true,
        })} BAN`;
    }

    search(value: string): void {
        this._searchService.emitSearch(value);
    }
}
