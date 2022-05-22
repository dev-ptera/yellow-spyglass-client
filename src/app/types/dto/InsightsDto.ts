export type InsightsDto = {
    blockCount: number;
    firstInTxUnixTimestamp: number;
    firstInTxHash: string;
    firstOutTxUnixTimestamp?: number;
    firstOutTxHash?: string;
    heightBalances?:
         Array<{
    balance: number;
    height: number;
}>;
    lastInTxUnixTimestamp: number;
    lastInTxHash: string;
    lastOutTxUnixTimestamp?: number;
    lastOutTxHash?: string;
    maxAmountReceivedHash: string;
    maxAmountReceived: number;
    maxAmountSentHash: string;
    maxAmountSent: number;
    maxBalanceHash: string;
    maxBalance: number;
    mostCommonSenderAddress: string;
    mostCommonSenderTxCount: number;
    mostCommonRecipientAddress?: string;
    mostCommonRecipientTxCount: number;
    totalAmountReceived: number;
    totalAmountSent: number;
    totalTxChange: number;
    totalTxReceived: number;
    totalTxSent: number;
};
