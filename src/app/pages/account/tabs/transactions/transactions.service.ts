import { Injectable } from '@angular/core';
import { Transaction } from '@app/pages/account/tabs/transactions/transactions-tab.component';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Injectable({
    providedIn: 'root',
})

/** This class handles data transformations for the transactions list. */
export class TransactionsService {
    constructor(private readonly _vp: ViewportService) {}

    getEmptyStateTitle(isPending: boolean): string {
        if (isPending) {
            return 'No Pending Transactions';
        }
        return 'No Confirmed Transactions';
    }

    getEmptyStateDescription(isPending: boolean): string {
        if (isPending) {
            return 'This account has already received all incoming payments.';
        }
        return 'This account has not received or sent anything yet.';
    }

    /** Populates map of hash->date info */
    createDateMap(
        transactions: Transaction[],
        dateMap: Map<string, { date: string; diffDays: number; relativeTime: string }>
    ): void {
        dateMap.clear();
        const currentDate = new Date().getTime() / 1000;
        const oneDay = 24 * 60 * 60; // hours*minutes*seconds*milliseconds
        transactions.map((tx) => {

            const diffDays = tx.timestamp ?
                Math.round(((currentDate - tx.timestamp) / oneDay) * 1000) / 1000 :
                undefined;
            dateMap.set(tx.hash, {
                date: this._formatDateString(tx.timestamp),
                diffDays,
                relativeTime: this.getRelativeTime(diffDays),
            });
        });
        return;
    }

    /** Converts timestamp to local time (e.g. 05:32:19 AM) . */
    getTime(timestamp: number): string {
        if (timestamp) {
            return new Date(timestamp * 1000).toLocaleTimeString();
        }
    }

    /** Given a number of days, returns a string representation of time. */
    getRelativeTime(days: number): string {
        if (!days) {
            return '';
        }

        if (days > 365) {
            const years = Math.round(days / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
        if (days > 30) {
            const months = Math.round(days / 30);
            return `${months} ${this._vp.sm ? 'mo' : 'month'}${months > 1 ? 's' : ''} ago`;
        }
        if (days > 7) {
            const weeks = Math.round(days / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
        if (days >= 1) {
            const rounded = Math.round(days);
            return `${rounded} day${rounded > 1 ? 's' : ''} ago`;
        }
        if (days < 1) {
            const hours = days * 24;
            if (hours > 1) {
                const roundedHours = Math.round(hours);
                return `${roundedHours} hour${roundedHours > 1 ? 's' : ''} ago`;
            }
            const roundedMinutes = Math.round(hours * 60);
            return `${roundedMinutes} ${this._vp.sm ? 'min' : 'minute'}${roundedMinutes > 1 ? 's' : ''} ago`;
        }
    }

    createTagClass(tx: Transaction, isPending: boolean): string {
        if (isPending) {
            return 'receive';
        }
        return tx.type;
    }

    private _formatDateString(timestamp: number): string {
        if (!timestamp) {
            return 'Unknown';
        }

        const date = new Date(timestamp * 1000);
        return `${date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}/${
            date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
        }/${this._vp.sm ? date.getFullYear().toString().substring(2, 4) : `${date.getFullYear()}`}`;
    }
}
