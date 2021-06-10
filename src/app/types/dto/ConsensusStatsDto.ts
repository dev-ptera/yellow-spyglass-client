export type ConsensusStatsDto = {
    allReps: {
        onlineTotal: number;
        onlinePercent: number;
        offlineTotal: number;
        offlinePercent;
    };
    noRep: {
        total: number;
        percent: number;
    };
    official: {
        onlineTotal: number;
        offlineTotal: number;
        onlinePercent: number;
        offlinePercent: number;
    };
    unofficial: {
        onlineTotal: number;
        offlineTotal: number;
        onlinePercent: number;
        offlinePercent: number;
    };
};
