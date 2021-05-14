export type AccountOverview = {
    opened: boolean;
    address: string;
    balanceRaw: string;
    pendingRaw: string;
    completedTxCount: number;
    pendingTxCount: number;
    delegatorsCount: number;
    representative: string;
};
