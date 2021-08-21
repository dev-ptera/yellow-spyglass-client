import { Component, Input } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'app-wave',
    template: `
        <div *ngIf="!vp.sm" style="position: fixed; width: 100%; z-index: -1; min-width: 1200px"
            [style.bottom.px]="bottom"
             [style.maxHeight.px]="maxHeight"

        >
            <img [src]="'assets/waves/wave' + waveNumber + '.svg'" />
        </div>
    `,
})
export class WaveComponent {
    @Input() waveNumber: number = 5;
    @Input() maxHeight: number;
    @Input() bottom: number = 0;

    constructor(public vp: ViewportService) {}
}
