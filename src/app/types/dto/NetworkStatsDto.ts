import { ConsensusStatsDto } from './ConsensusStatsDto';
import { SupplyDto } from './SupplyDto';
import { QuorumDto } from './QuorumDto';
import { PeerVersionsDto } from './PeerVersionsDto';

export type NetworkStatsDto = {
    consensus: ConsensusStatsDto;
    supply: SupplyDto;
    quorum: QuorumDto;
    nakamotoCoefficient: number;
    peerVersions: PeerVersionsDto[];
    principalRepMinBan: number;
    // repWeights: number[];
};
