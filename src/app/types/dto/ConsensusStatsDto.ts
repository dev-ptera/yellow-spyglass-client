export type ConsensusStatsDto = {
    allReps: {
        onlineAmount: number;
        onlinePercent: number;
        offlineAmount: number;
        offlinePercent;
    };
    noRep: {
        amount: number;
        percent: number;
    };
    official: {
        onlineAmount: number;
        offlineAmount: number;
        onlinePercent: number;
        offlinePercent: number;
    };
    unofficial: {
        onlineAmount: number;
        offlineAmount: number;
        onlinePercent: number;
        offlinePercent: number;
    };
};
