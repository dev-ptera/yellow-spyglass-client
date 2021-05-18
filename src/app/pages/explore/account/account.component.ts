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
import { AccountOverviewDto, ConfirmedTransactionDto, DelegatorDto, PendingTransactionDto } from '../../../types';
import { ViewportService } from '../../../services/viewport/viewport.service';
import { ApiService } from '../../../services/api/api.service';
import { rawToBan } from 'banano-unit-converter';
import { StateType } from '../../../types/modal/stateType';
import { UtilService } from '../../../services/util/util.service';
import {Delegator} from "../../../types/modal/Delegator";
import {ConfirmedTransaction} from "../../../types/modal/ConfirmedTransaction";
import {PendingTransaction} from "../../../types/modal/PendingTransactionDto";
import {PageEvent} from "@angular/material/paginator";


@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AccountComponent {
    @Input() accountOverview: AccountOverviewDto;
    @Input() loading: boolean;
    @Input() address: string;
    @Input() monkeySvg: string;
    @Output() search: EventEmitter<string> = new EventEmitter<string>();

    delegators: Delegator[];
    pendingTransactions: PendingTransactionDto[];
    confirmedTransactions: ConfirmedTransaction[];
    paginatorSize: 50;

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
            this._processDelegators(this.accountOverview);
            this._processConfirmed(this.accountOverview);
            this.pendingTransactions = this.accountOverview.pendingTransactions;
        }
    }

    private _processDelegators(accountOverview: AccountOverviewDto): void {
        this.delegators = [];
        for (const delegator of accountOverview.delegators) {
            this.delegators.push({
                address: delegator.address,
                weight: this._rawToBan(delegator.weightRaw)
            })
        }
    }

    private _processConfirmed(accountOverview: AccountOverviewDto): void {
        this.confirmedTransactions = [];
        for (const confirmedTx of accountOverview.confirmedTransactions) {
            this.confirmedTransactions.push(
                {
                    balance: this._sendReceiveRawToBan(confirmedTx.balanceRaw),
                    hash: confirmedTx.hash,
                    type: confirmedTx.type,
                    height: `#${this._util.numberWithCommas(confirmedTx.height)}`,
                    address: confirmedTx.address || confirmedTx.newRepresentative,
                    date: this.formatDateString(confirmedTx.timestamp),
                    time: this.formatTimeString(confirmedTx.timestamp)
                }
            )
        }
    }

    private _rawToBan(raw: string): string {
        if (!raw) {
            return '0';
        }
        return Number(rawToBan(raw))
            .toFixed(10)
            .replace(/\.?0+$/, '');
    }



    private _sendReceiveRawToBan(raw: string, state?: StateType): string {
        if (!raw || raw === '0') {
            return '0 BAN';
        }
        const modifier = state === 'receive' ? '+' : '-';
        const ban = Number(rawToBan(raw))
            .toFixed(10)
            .replace(/\.?0+$/, '');
        if (state) {
            return `${modifier}${this._util.numberWithCommas(ban)} BAN`;
        } else {
            return `${this._util.numberWithCommas(ban)} BAN`;
        }
    }


    renderQRCode(addr: string): void {
        this._ref.detectChanges();
        const canvas = document.getElementById('qr-code');
        QRCode.toCanvas(canvas, addr, function (error) {
            if (error) console.error(error);
        });
    }

    convertRawToBan(raw: string, state?: StateType): string {
        if (!raw) {
            return '';
        }
        if (raw === '0') {
            return '0 BAN';
        }
        const modifier = state === 'receive' ? '+' : '-';
        const ban = Number(rawToBan(raw))
            .toFixed(10)
            .replace(/\.?0+$/, '');
        if (state) {
            return `${modifier}${this._util.numberWithCommas(ban)} BAN`;
        } else {
            return `${this._util.numberWithCommas(ban)} BAN`;
        }
    }

    formatDateString(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return (
            (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
            '/' +
            (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
            '/' +
            (this.vp.sm ? date.getFullYear().toString().substring(2,4) : date.getFullYear() + '')
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


    changePage(e: PageEvent): void {
        console.log(e);
    }
}
