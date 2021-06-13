export type InsightsDto = {
    data: Array<{
        balance: number;
        height: number;
    }>;
    maxAmountReceivedHash: string;
    maxAmountReceivedBan: number;
    maxAmountSentHash: string;
    maxAmountSentBan: number;
    maxBalanceHash: string;
    maxBalanceBan: number;
    mostCommonSenderAddress: string;
    mostCommonSenderTxCount: number;
    mostCommonRecipientAddress: string;
    mostCommonRecipientTxCount: number;
};
