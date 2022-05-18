export type SharedRepProps = {
    score?: number;
    principal?: boolean;
    uptimePercentages?: {
        day: number;
        week: number;
        month: number;
        semiAnnual: number;
        year: number;
    };
};
