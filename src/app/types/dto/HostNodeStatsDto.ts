import { MonitoredRepDto } from './MonitoredRepDto';

export type HostNodeStatsDto = MonitoredRepDto & {
    ledgerSizeMb: number;
    availableDiskSpaceGb: number;
};
