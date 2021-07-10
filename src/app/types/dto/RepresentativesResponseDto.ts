import { RepresentativeDto } from './RepresentativeDto';
import { MonitoredRepDto } from './MonitoredRepDto';

export type RepresentativesResponseDto = {
    /** Aggregate voting weight from online reps.  Populated by nano RPC. */
    onlineWeight: number;
    /** These representatives are populated directly by the nano RPC and have at least 100,000 BAN voting weight */
    thresholdReps: RepresentativeDto[];
    /** These representatives are populated by querying the peers
     * the node is connected to & then inspecting each peer for a nano node monitor. */
    monitoredReps: MonitoredRepDto[];
};
