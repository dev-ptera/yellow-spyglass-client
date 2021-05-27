import { RepresentativeDto } from './RepresentativeDto';
import { MonitoredRepDto } from './MonitoredRepDto';

export type RepresentativesResponseDto = {
    onlineWeight: number;
    representatives: RepresentativeDto[];
    monitoredReps: MonitoredRepDto[];
};
