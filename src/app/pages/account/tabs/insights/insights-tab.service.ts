import { Injectable } from '@angular/core';
import { InsightsDto } from '@app/types/dto';

@Injectable({
    providedIn: 'root',
})
export class InsightsTabService {
    private insights: InsightsDto;

    forgetAccount(): void {
        this.insights = undefined;
    }

    shouldLoadInsights(): boolean {
        return !this.insights;
    }

    setInsights(insights: InsightsDto): void {
        this.insights = insights;
    }

    getInsights(): InsightsDto {
        return this.insights;
    }
}
