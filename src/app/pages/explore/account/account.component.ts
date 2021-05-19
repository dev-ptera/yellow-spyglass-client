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
import { AccountOverviewDto, ConfirmedTransactionDto, PendingTransactionDto } from '../../../types';
import { ViewportService } from '../../../services/viewport/viewport.service';
import { ApiService } from '../../../services/api/api.service';
import { rawToBan } from 'banano-unit-converter';
import { StateType } from '../../../types/modal/stateType';
import { UtilService } from '../../../services/util/util.service';
import { Delegator } from '../../../types/modal/Delegator';
import { ConfirmedTransaction } from '../../../types/modal/ConfirmedTransaction';
import { PageEvent } from '@angular/material/paginator';

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

    pendingBalance: string;
    confirmedBalance: string;

    delegators: Delegator[] = [];

    // TODO!
    pendingTransactions: PendingTransactionDto[] = [];

    confirmedTransactions: {
        all: ConfirmedTransaction[];
        display: ConfirmedTransaction[];
    };

    paginatorSize = 50;
    currentPage = 0;
    loadedPages: Set<number>;

    constructor(
        public vp: ViewportService,
        private readonly _util: UtilService,
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.address && changes.address.currentValue) {
            console.log('ADDRESS CHANGED RUNNING CD');
            this.renderQRCode(this.address);
        }
        if (changes.accountOverview && changes.accountOverview.currentValue) {
            this._prepareNewAccount();
        }
    }

    private _prepareNewAccount(): void {
        this.currentPage = 0;
        this.loadedPages = new Set<number>().add(0);
        this._prepareAccountOverview(this.accountOverview);
        this._prepareDelegators(this.accountOverview);
        this._prepareConfirmed(this.accountOverview);
        this.pendingTransactions = this.accountOverview.pendingTransactions;
    }

    private _prepareAccountOverview(accountOverview: AccountOverviewDto): void {
        const approxBalance = accountOverview.balanceRaw !== '0';
        const approxPending = accountOverview.pendingRaw !== '0';
        this.confirmedBalance = this._util.numberWithCommas(this._rawToBan(accountOverview.balanceRaw, 2));
        if (approxBalance && this.confirmedBalance === '0') {
            this.confirmedBalance = '~0';
        }
        this.pendingBalance = this._util.numberWithCommas(this._rawToBan(accountOverview.pendingRaw, 2));
        if (approxPending && this.pendingBalance === '0') {
            this.pendingBalance = '~0';
        }
    }

    private _prepareDelegators(accountOverview: AccountOverviewDto): void {
        this.delegators = [];
        for (const delegator of accountOverview.delegators) {
            this.delegators.push({
                address: delegator.address,
                weight: this._rawToBan(delegator.weightRaw, 3),
            });
        }
        this.delegators.sort((a, b) => (Number(a.weight) < Number(b.weight) ? 1 : -1));
        for (const delegator of this.delegators) {
            delegator.weight = this._util.numberWithCommas(delegator.weight);
            if (delegator.weight === '0') {
                delegator.weight = '~0';
            }
        }
    }

    private _prepareConfirmed(accountOverview: AccountOverviewDto): void {
        this.confirmedTransactions = {
            all: [],
            display: [],
        };
        for (const confirmedTx of accountOverview.confirmedTransactions) {
            this.confirmedTransactions.all.push(this._convertConfirmedTxDtoToModal(confirmedTx));
        }
        this.confirmedTransactions.display = this.confirmedTransactions.all;
    }

    private _convertConfirmedTxDtoToModal(tx: ConfirmedTransactionDto): ConfirmedTransaction {
        return {
            balance: this._sendReceiveRawToBan(tx.balanceRaw),
            hash: tx.hash,
            type: tx.type,
            height: tx.height,
            formatHeight: `#${this._util.numberWithCommas(tx.height)}`,
            address: tx.address || tx.newRepresentative,
            date: this.formatDateString(tx.timestamp),
            time: this.formatTimeString(tx.timestamp),
        };
    }

    private _rawToBan(raw: string, precision = 10): string {
        if (!raw || raw === '0') {
            return '0';
        }
        return Number(rawToBan(raw))
            .toFixed(precision)
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
            (this.vp.sm ? date.getFullYear().toString().substring(2, 4) : date.getFullYear() + '')
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

    private _setDisplayTx(tx: { display: any[]; all: any[] }, pageIndex: number): void {
        const pageSize = this.paginatorSize;
        tx.display = tx.all.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
    }

    changePage(e: PageEvent): void {
        this.currentPage = e.pageIndex;
        if (this.loadedPages.has(e.pageIndex)) {
            this._setDisplayTx(this.confirmedTransactions, e.pageIndex);
            return;
        }
        this._apiService
            .confirmedTransactions(this.address, e.pageSize * e.pageIndex)
            .then((data: ConfirmedTransactionDto[]) => {
                this.loadedPages.add(e.pageIndex);
                for (const tx of data) {
                    this.confirmedTransactions.all.push(this._convertConfirmedTxDtoToModal(tx));
                }
                this.confirmedTransactions.all.sort((a, b) => (a.height < b.height ? 1 : -1));
                // Debounce monkey fetch api
                this._setDisplayTx(this.confirmedTransactions, e.pageIndex);
                this._ref.detectChanges();
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
