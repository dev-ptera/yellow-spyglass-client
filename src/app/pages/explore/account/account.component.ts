import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import * as QRCode from 'qrcode';
import { AccountOverview } from '../../../types';
import { ViewportService } from '../../../services/viewport/viewport.service';
import { ApiService } from '../../../services/api/api.service';

@Component({
    selector: 'app-account',
    template: ` 
        <div class="account-header">
            <div class="account-monkey-title">
                <div
                    pxb-icon
                    style="height: 150px; width: 150px"
                    *ngIf="monkeyTest"
                    [innerHTML]="monkeyTest | safe"
                ></div>
                <div>
                    <div class="mat-display-2" [style.marginBottom.px]="8">
                        {{ loading ? 'Loading' : 'Account Information' }}
                    </div>
                    <div class="mat-subheading-1" style="word-break: break-all">
                        {{ address }}
                    </div>
                </div>
            </div>
            <div>
                <canvas id="qr-code" [style.display.none]="!monkeyTest"></canvas>
            </div>
        </div>

        <mat-tab-group *ngIf="!loading" class="account-tabs">
            <mat-tab>
                <ng-template mat-tab-label>
                    <span color="primary" [matBadge]="accountOverview.completedTxCount" matBadgeOverlap="false">
                        Completed Transactions
                    </span>
                </ng-template>
                <div class="account-history">
                    <mat-list [style.paddingTop.px]="0">
                        <pxb-info-list-item
                            *ngFor="let tx of confirmedTransactions?.accountHistory?.history"
                            [divider]="true"
                            [wrapTitle]="true"
                            [wrapSubtitle]="false"
                            style="background-color: white"
                        >
                            <div *ngIf="monkeyTest" pxb-icon [innerHTML]="monkeyTest | safe"></div>
                            <div (click)="search.emit(tx.account)" pxb-title>{{ tx.account }}</div>
                            <div pxb-subtitle>{{ tx.hash }}</div>
                            <div pxb-right-content>
                                <pxb-list-item-tag [label]="tx.type"></pxb-list-item-tag>
                            </div>
                        </pxb-info-list-item>
                    </mat-list>
                </div>
            </mat-tab>

            <mat-tab>
                <ng-template mat-tab-label>
                    <span color="primary" [matBadge]="accountOverview.pendingTxCount" matBadgeOverlap="false">
                        Pending Transactions
                    </span>
                </ng-template>
                <div class="account-history"></div>
            </mat-tab>

            <mat-tab>
                <ng-template mat-tab-label>
                    <span color="primary" [matBadge]="accountOverview.delegatorsCount" matBadgeOverlap="false">
                        Delegators
                    </span>
                </ng-template>

                <div class="account-history"></div>
            </mat-tab>
        </mat-tab-group>`,
    styleUrls: ['account.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AccountComponent {
    @Input() accountOverview: AccountOverview;
    @Input() confirmedTransactions: any;
    @Input() loading: boolean;
    @Input() address: string;
    @Input() monkeyTest: string;
    @Output() search: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private readonly _viewportService: ViewportService,
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes.address) {
            this.renderQRCode(this.address);
        }
    }

    renderQRCode(addr: string): void {
        this._ref.detectChanges();
        const canvas = document.getElementById('qr-code');
        QRCode.toCanvas(canvas, addr, function (error) {
            if (error) console.error(error);
        });
    }
}
