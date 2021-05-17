import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import * as QRCode from 'qrcode';
import {AccountOverview, ConfirmedTransaction, Delegator, PendingTransaction} from '../../../types';
import { ViewportService } from '../../../services/viewport/viewport.service';
import { ApiService } from '../../../services/api/api.service';
import { rawToBan } from 'banano-unit-converter';
import { StateType } from '../../../types/modal/stateType';
import { UtilService } from '../../../services/util/util.service';

@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AccountComponent {
    @Input() accountOverview: AccountOverview;
    @Input() loading: boolean;
    @Input() address: string;
    @Input() monkeySvg: string;
    @Output() search: EventEmitter<string> = new EventEmitter<string>();

    delegators: Delegator[];
    pendingTransactions: PendingTransaction[];
    confirmedTransactions: ConfirmedTransaction[];

    constructor(
        public vp: ViewportService,
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef,
        private readonly _util: UtilService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.address) {
            console.log('ADDRESS CHANGED RUNNING CD');
            this.renderQRCode(this.address);
        }
        if (changes.accountOverview) {
            this.delegators = this.accountOverview.delegators;
            this.confirmedTransactions = this.accountOverview.confirmedTransactions;
            this.pendingTransactions = this.accountOverview.pendingTransactions;
        }
    }

    renderQRCode(addr: string): void {
        this._ref.detectChanges();
        const canvas = document.getElementById('qr-code');
        QRCode.toCanvas(canvas, addr, function (error) {
            if (error) console.error(error);
        });
    }

    convertRawToBan(raw: string, state: StateType): string {
        const modifier = state === 'receive' ? '+' : '-';
        const ban = Number(rawToBan(raw))
            .toFixed(10)
            .replace(/\.?0+$/, '');
        return `${modifier}${this._util.numberWithCommas(ban)} BAN`;
    }

    formatDateString(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return (
            (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
            '/' +
            (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
            '/' +
            date.getFullYear()
        );
    }

    addComma(num: number): string {
        return this._util.numberWithCommas(num);
    }

    formatTimeString(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return date.toTimeString().substr(0, 8);
    }

    formatBadge(count: number): string {
        return this._util.numberWithCommas(count);
    }

    trackByFn(index) {
        return index;
    }
}
