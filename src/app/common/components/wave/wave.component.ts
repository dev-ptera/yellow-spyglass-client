import { Component, Input } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ThemeService } from '@app/services/theme/theme.service';

@Component({
    selector: 'app-wave',
    template: `
        <div
            *ngIf="!vp.sm"
            style="position: fixed; width: 100%; z-index: -1; min-width: 2000px"
            [style.bottom.px]="bottom"
            [style.maxHeight.px]="maxHeight"
        >
            <img [src]="getSource()" />
        </div>
    `,
})
export class WaveComponent {
    @Input() darkThemeWaveNumber = 5;
    @Input() lightThemeWaveNumber = 23;
    @Input() maxHeight: number;
    @Input() bottom = -12;

    constructor(public vp: ViewportService, public theme: ThemeService) {}

    getSource(): string {
        return `assets/waves/wave${
            this.theme.isLightMode() ? this.lightThemeWaveNumber : this.darkThemeWaveNumber
        }.svg`;
    }
}
