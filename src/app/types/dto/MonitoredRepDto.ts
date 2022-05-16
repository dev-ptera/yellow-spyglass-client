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
};
