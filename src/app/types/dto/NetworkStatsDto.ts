import { ConsensusStatsDto } from './ConsensusStatsDto';
import { SupplyDto } from './SupplyDto';
import { QuorumDto } from './QuorumDto';
import {PeerVersionsDto} from "@app/types/dto/PeerVersionsDto";

export type NetworkStatsDto = {
    consensus: ConsensusStatsDto;
    supply: SupplyDto;
    quorum: QuorumDto;
    nakamotoCoefficient: number;
    peerVersions: PeerVersionsDto[]
    // repWeights: number[];
};
