export type InsightsDto = {
    data: Array<{
        raw: string;
        height: number;
    }>;
    maxAmountReceivedHash: string;
    maxAmountReceivedRaw: string;
    maxAmountSentHash: string;
    maxAmountSentRaw: string;
    maxBalanceRaw: string;
    maxBalanceHash: string;
};
