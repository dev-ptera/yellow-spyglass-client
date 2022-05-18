import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'rep-score',
    template: `
        <!--
            [class.warn]="score <= 50"
            [class.intermediary]="score > 50 && score <= 84"
            [class.primary]="score > 84"
        -->
        <span *ngIf="score">
            {{ score }}
        </span>
        <span *ngIf="score" style="font-size: 11px">/ 100</span>
        <span *ngIf="!score">--</span>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class ScoreMetricComponent {
    @Input() score: number;

    constructor(public vp: ViewportService) {}
}
