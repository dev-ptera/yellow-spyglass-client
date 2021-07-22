export type RepresentativeDto = {
    address: string;
    weight: number;
    online: boolean;
    principal: boolean;
    delegatorsCount: number;
    uptimePercentDay?: number;
    uptimePercentWeek?: number;
    uptimePercentMonth?: number;
    uptimePercentSemiAnnual?: number;
    uptimePercentYear?: number;
};
