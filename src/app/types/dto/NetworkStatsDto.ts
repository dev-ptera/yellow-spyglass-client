import { ConsensusStatsDto } from './ConsensusStatsDto';
import { DistributionStatsDto } from './DistributionStatsDto';
import { Quorum } from '../model';

export type NetworkStatsDto = {
    consensus: ConsensusStatsDto;
    distribution: DistributionStatsDto;
    quorum: Quorum;
    nakamotoCoefficient: number;
    repWeights: number[];
};
