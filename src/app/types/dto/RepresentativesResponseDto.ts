import { RepresentativeDto } from './RepresentativeDto';
import { MonitoredRepDto } from './MonitoredRepDto';

export type RepresentativesResponseDto = {
    /** Aggregate voting weight from online reps.  Populated by nano RPC. */
    onlineWeight: number;
    /** These representatives are populated directly by the nano RPC. */
    representatives: RepresentativeDto[];
    /** These representatives are populated by querying the peers
     * the node is connected to & then inspecting each peer for a nano node monitor. */
    monitoredReps: MonitoredRepDto[];
};
