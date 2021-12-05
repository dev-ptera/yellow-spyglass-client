import { SupplyDto } from './SupplyDto';
import { PeerVersionsDto } from './PeerVersionsDto';
import { SpyglassAPIQuorumDto } from '@app/types/dto/QuorumDto';

export type NetworkStatsDto = {
    supply: SupplyDto;
    nakamotoCoefficient: number;
    peerVersions: PeerVersionsDto[];
    spyglassQuorum: SpyglassAPIQuorumDto;
    principalRepMinBan: number;
    /** This value is populated whenever the account distribution metrics are updated. */
    openedAccounts: number;
};
