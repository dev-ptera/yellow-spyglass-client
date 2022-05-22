import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { SearchService } from '@app/services/search/search.service';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { PaginatorComponent } from '@app/common/components/paginator/paginator.component';
import { UtilService } from '@app/services/util/util.service';
import { AliasService } from '@app/services/alias/alias.service';
import { ApiService } from '@app/services/api/api.service';

type Transaction = {
    amount?: number;
    hash: string;
    type?: 'receive' | 'send' | 'change';
    height?: number;
    address?: string;
    timestamp: number;
    newRepresentative?: string;
};

@Component({
    selector: 'account-tx-tab',
    template: `
        <ng-container *ngIf="transactions.length !== 0">
            <ng-template [ngTemplateOutlet]="paginator"></ng-template>
            <mat-divider></mat-divider>
        </ng-container>
        <mat-list class="tab-transaction-list" *ngIf="transactions.length >= 0" responsive>
            <blui-info-list-item
                *ngFor="let tx of transactions; trackBy: trackByFn; let last = last"
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
                        [class]="createTagClass(tx)"
                    ></blui-list-item-tag>
                </div>
                <div blui-title>
                    <div class="tag-row">
                        <!-- Default type to receive. -->
                        <!--
                        <blui-list-item-tag
                            [label]="tx.type || 'receive'"
                            [class]="'type ' + tx.type || 'receive'"></blui-list-item-tag>
                            -->

                        <span *ngIf="tx.type !== 'change'" class="amount">
                            {{ tx.type === 'receive' || isPending ? '+' : '-' }}
                            {{ util.numberWithCommas(tx.amount) }}
                        </span>
                    </div>
                    <div>
                        <ng-container *ngIf="!tx.type || tx.type === 'receive'">
                            <span class="to-from text-secondary">from</span>
                            <span class="address link" (click)="searchService.emitSearch(tx.address, $event.ctrlKey)">
                                {{ aliasService.get(tx.address) || tx.address }}
                            </span>
                        </ng-container>

                        <ng-container *ngIf="tx.type === 'send'">
                            <span class="to-from text-secondary">to</span>
                            <span class="address link" (click)="searchService.emitSearch(tx.address, $event.ctrlKey)">
                                {{ aliasService.get(tx.address) || tx.address }}
                            </span>
                        </ng-container>

                        <ng-container *ngIf="tx.type === 'change'">
                            <span class="to-from text-secondary">to</span>
                            <span
                                class="address link"
                                (click)="searchService.emitSearch(tx.newRepresentative, $event.ctrlKey)"
                            >
                                {{ aliasService.get(tx.newRepresentative) || tx.newRepresentative }}
                            </span>
                        </ng-container>
                    </div>
                </div>
                <div blui-subtitle class="hash text-hint mat-body-2">
                    <span *ngIf="tx.height"><span style="margin-right: 4px">#</span>{{ util.numberWithCommas(tx.height) }}</span>
                    <span style="margin: 0 4px" *ngIf="tx.height">·</span>
                    <span class="link" (click)="searchService.emitSearch(tx.hash, $event.ctrlKey)">{{ tx.hash }}</span>
                </div>
                <div blui-right-content class="right-content">
                    <div *ngIf="vp.sm" class="small-monkey">
                        <img [src]="apiService.createMonKeyUrl(tx.address || tx.newRepresentative)" loading="lazy" />
                    </div>
                    <div class="timestamps">
                        <span class="mat-body-2">{{ dateMap.get(tx.hash).date }}</span>
                        <span class="mat-body-2 text-secondary" [style.fontSize.px]="vp.sm ? 10 : 14">
                            {{ dateMap.get(tx.hash).diffDays }} days ago
                        </span>
                    </div>
                </div>
            </blui-info-list-item>
            <ng-container *ngIf="transactions.length !== 0">
                <mat-divider></mat-divider>
                <ng-template [ngTemplateOutlet]="paginator"></ng-template>
            </ng-container>
        </mat-list>

        <div *ngIf="transactions.length === 0" class="tab-empty-state">
            <blui-empty-state
                responsive
                class="account-empty-state"
                [title]="getEmptyStateTitle()"
                [description]="getEmptyStateDescription()"
            >
                <mat-icon blui-empty-icon>paid</mat-icon>
            </blui-empty-state>
        </div>
    `,
    styleUrls: ['transactions-tab.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TransactionsTabComponent {
    @Input() transactions: Transaction[];
    @Input() isPending: boolean;
    @Input() paginator: TemplateRef<PaginatorComponent>;
    dateMap: Map<string, { date: string; diffDays: number }> = new Map();

    constructor(
        public aliasService: AliasService,
        public apiService: ApiService,
        public searchService: SearchService,
        public vp: ViewportService,
        public util: UtilService
    ) {}

    ngOnChanges(): void {
        this.dateMap.clear();
        const currentDate = new Date().getTime() / 1000;
        const oneDay = 24 * 60 * 60; // hours*minutes*seconds*milliseconds
        this.transactions.map((tx) => {
            this.dateMap.set(tx.hash, {
                date: this._formatDateString(tx.timestamp),
                diffDays: Math.round(Math.abs((currentDate - tx.timestamp) / oneDay)),
            });
        });
    }

    trackByFn(index: number): number {
        return index;
    }

    getEmptyStateTitle(): string {
        return `No ${this.isPending ? 'Pending' : 'Receivable'} Transactions`;
    }
    getEmptyStateDescription(): string {
        if (this.isPending) {
            return 'This account has already received all incoming payments.';
        }
        return 'This account has not received or sent anything yet.';
    }

    createTagClass(tx: Transaction): string {
        if (this.isPending) {
            return 'receive';
        }
        return tx.type;
    }

    private _formatDateString(timestamp: number): string {
        if (!timestamp) {
            return '';
        }

        const date = new Date(timestamp * 1000);
        return `${date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}/${
            date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
        }/${this.vp.sm ? date.getFullYear().toString().substring(2, 4) : `${date.getFullYear()}`}`;
    }
}
