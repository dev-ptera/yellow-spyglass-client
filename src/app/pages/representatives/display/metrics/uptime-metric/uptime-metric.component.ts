import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RepScoreDto } from '@app/types/dto';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'rep-uptime',
    template: `
        <ng-container *ngIf="uptimePercentages">
            <span
                [class.warn]="uptimePercentages.month <= 80"
                [class.intermediary]="uptimePercentages.month > 80 && uptimePercentages.month <= 95"
                [class.primary]="uptimePercentages.month > 95"
            >
                {{ uptimePercentages.month }}<span style="font-size: 11px">% </span>
            </span>
            <span *ngIf="!vp.md" style="font-size: 12px"
                >· {{ uptimePercentages.week }}<span style="font-size: 11px">% </span> · {{ uptimePercentages.day
                }}<span style="font-size: 11px">% </span>
            </span>
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class UptimeMetricComponent {
    @Input() uptimePercentages: RepScoreDto['uptimePercentages'];

    constructor(public vp: ViewportService) {}
}
