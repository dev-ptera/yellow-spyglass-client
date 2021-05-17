import { ConfirmedTransaction } from './ConfirmedTransaction';
import { PendingTransaction } from './PendingTransaction';
import { Delegator } from './Delegator';

export type AccountOverview = {
    opened: boolean;
    address: string;
    balanceRaw: string;
    pendingRaw: string;
    completedTxCount: number;
    pendingTxCount: number;
    delegatorsCount: number;
    representative: string;
    confirmedTransactions: ConfirmedTransaction[];
    pendingTransactions: PendingTransaction[];
    delegators: Delegator[];
};
