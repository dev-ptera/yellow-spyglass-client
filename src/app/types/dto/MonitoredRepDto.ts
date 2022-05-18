export type MonitoredRepDto = {
    address: string;
    online: boolean;
    delegatorsCount: number;

    /* Optional (populated from node-monitor) */
    cementedBlocks?: number;
    confirmationInfo?: {
        average: number;
    };
    currentBlock?: number;
    location?: string;
    ip?: string;
    name?: string;
    nodeUptimeStartup?: number;
    representative?: string;
    peers?: number;
    totalMem?: number;
    systemLoad?: number;
    uncheckedBlocks?: number;
    usedMem?: number;
    version?: string;
    weight?: number;

    /** Populated these stats from scores. */
    daysAge: number;
    principal: boolean;
    score: number;
    uptimePercentages?: {
        day: number;
        week: number;
        month: number;
        semiAnnual: number;
        year: number;
    };
};
