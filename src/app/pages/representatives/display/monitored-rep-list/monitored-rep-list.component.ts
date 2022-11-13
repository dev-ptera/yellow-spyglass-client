import { ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { MonitoredRepDto } from '@app/types/dto';
import { UtilService } from '@app/services/util/util.service';
import { MatSort } from '@angular/material/sort';
import { AliasService } from '@app/services/alias/alias.service';
import { RepresentativesService } from '@app/pages/representatives/representatives.service';
import { APP_NAV_ITEMS } from '../../../../navigation/nav-items';

@Component({
    selector: 'app-monitored-rep-list',
    template: `
        <mat-card class="rep-mobile-list-container mat-elevation-z0">
            <mat-list [style.paddingTop.px]="0" class="monitored-rep-list">
                <blui-info-list-item
                    *ngFor="let rep of monitoredReps; trackBy: trackByFn; let last = last"
                    [hidePadding]="true"
                    [dense]="false"
                    [wrapSubtitle]="true"
                    [divider]="last ? undefined : 'full'"
                >
                    <div blui-title style="font-weight: 600">
                        <a class="link text" [href]="repService.getMonitoredRepUrl(rep)">{{ rep.name }}</a>
                    </div>
                    <div blui-info style="font-size: 0.875rem" class="text-secondary">{{ formatInfoLine(rep) }}</div>
                    <div
                        blui-subtitle
                        style="font-size: 0.875rem; padding-right: 16px; padding-top: 8px; padding-bottom: 10px;"
                    >
                        <a class="link text mono" [routerLink]="'/' + navItems.account.route + '/' + rep.address">
                            {{ rep.address }}
                        </a>
                    </div>
                    <div blui-right-content style="display: flex; flex-direction: column; align-items: flex-end">
                        <div style="font-size: 0.875rem">{{ formatWeightPercent(rep.weight) }} weight</div>
                        <div style="font-size: 0.75rem; display: flex; align-items: center">
                            <img src="assets/icons/banano-mark.svg" [width]="16" [height]="16" style="margin-right: 6px" />
                            <span class="text-secondary">{{ formatBanWeight(rep.weight) }}</span>
                        </div>
                    </div>
                </blui-info-list-item>
            </mat-list>
        </mat-card>
    `,
    styles: [
        `
            .monitored-rep-list .mat-list-item-content {
                padding: 24px 0 24px 0 !important;
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MonitoredRepListComponent {
    @Input() monitoredReps: MonitoredRepDto[] = [];
    @Input() onlineWeight: number;

    @ViewChild('sortMonitored') sortMonitored: MatSort;

    navItems = APP_NAV_ITEMS;

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
        public repService: RepresentativesService,
        private readonly _util: UtilService,
        private readonly _ref: ChangeDetectorRef
    ) {}

    trackByFn(index: number): number {
        return index;
    }

    numberWithCommas(count: number): string {
        return `${this._util.numberWithCommas(count)}`;
    }

    formatWeightPercent(weight: number): string {
        return `${((weight / this.onlineWeight) * 100).toFixed(3).replace(/\.?0+$/, '')}%`;
    }

    formatBanWeight(weight: number): string {
        return this._util.numberWithCommas(Math.round(weight));
    }

    formatInfoLine(rep: MonitoredRepDto): string {
        const version = this.repService.formatVersion(rep.version);
        const delegators = this.numberWithCommas(rep.delegatorsCount);
        const peers = this.numberWithCommas(rep.peers);
        return `${version} ${version ? ' · ' : ''}  ${delegators} ${delegators ? ' delegators · ' : ''} ${peers} ${
            peers ? ' peers' : ''
        }`;
    }
}
