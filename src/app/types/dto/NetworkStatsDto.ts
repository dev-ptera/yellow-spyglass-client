import { ConsensusStatsDto } from './ConsensusStatsDto';
import { SupplyDto } from './SupplyDto';
import { QuorumDto } from './QuorumDto';

export type NetworkStatsDto = {
    consensus: ConsensusStatsDto;
    supply: SupplyDto;
    quorum: QuorumDto;
    nakamotoCoefficient: number;
    // repWeights: number[];
};
