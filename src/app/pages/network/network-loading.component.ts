import { Component, Input, ViewEncapsulation } from '@angular/core';
import { faded } from '@app/common/animations/animations';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'app-network-loading',
    animations: [faded],
    template: `
        <div *ngIf="show" @fade>
            <!--style="position: absolute; width: 40%; z-index: 999"-->
            <mat-card
                class="ph-item divider-border"
                style="width: 100%; margin-bottom: 24px; padding: 16px;"
                [style.height.px]="vp.sm ? 300 : 275"
            >
                <div class="ph-col-12" style="padding: 0">
                    <div class="ph-row">
                        <div class="ph-col-4" style="height: 36px;"></div>
                    </div>
                    <div class="ph-row">
                        <div class="ph-col-6" style="height: 22px;"></div>
                    </div>
                    <div class="ph-row" style="display: flex; justify-content: center; margin: 32px 0">
                        <div class="ph-avatar" style="height: 56px; width: 56px"></div>
                    </div>
                    <div class="ph-row">
                        <div class="ph-col-12" style="height: 22px;"></div>
                    </div>
                    <div class="ph-row">
                        <div class="ph-col-4" style="height: 14px;"></div>
                    </div>
                </div>
            </mat-card>

            <div
                style="display: flex; justify-content: space-between"
                [style.flex-direction]="vp.sm ? 'column' : 'row'"
            >
                <ng-template [ngTemplateOutlet]="graphLoading"></ng-template>
                <ng-template [ngTemplateOutlet]="graphLoading"></ng-template>
            </div>

            <ng-template #graphLoading>
                <mat-card
                    class="ph-item divider-border"
                    style="margin: 0; margin-bottom: 32px; padding: 16px;"
                    [style.width.%]="vp.sm ? 100 : 49"
                    [style.height.px]="vp.sm ? 475 : 620"
                >
                    <div class="ph-col-12" style="padding: 0">
                        <div class="ph-row">
                            <div class="ph-col-6" style="height: 36px;"></div>
                        </div>
                        <div class="ph-row">
                            <div class="ph-col-10" style="height: 22px;"></div>
                        </div>
                        <div
                            class="ph-row"
                            style="display: flex; justify-content: center;"
                            [style.marginTop.px]="vp.sm ? 24 : 48"
                            [style.marginBottom.px]="vp.sm ? 36 : 92"
                        >
                            <div
                                class="ph-avatar"
                                [style.height.px]="vp.sm ? 120 : 170"
                                [style.width.px]="vp.sm ? 120 : 170"
                            ></div>
                        </div>
                        <div class="ph-row">
                            <div class="ph-col-12" style="height: 22px;"></div>
                        </div>
                        <div class="ph-row">
                            <div class="ph-col-12" style="height: 22px;"></div>
                        </div>
                        <div class="ph-row">
                            <div class="ph-col-12" style="height: 22px;"></div>
                        </div>
                        <div class="ph-row">
                            <div class="ph-col-12" style="height: 22px;"></div>
                        </div>
                    </div>
                </mat-card>
            </ng-template>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class NetworkLoadingComponent {
    @Input() show;

    constructor(public vp: ViewportService) {}
}
