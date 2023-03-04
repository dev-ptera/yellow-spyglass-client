import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { AliasService } from '@app/services/alias/alias.service';
import { APP_NAV_ITEMS } from '../../../navigation/nav-items';

@Component({
    selector: 'app-account-alias',
    styleUrls: ['alias.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div
            *ngIf="(aliasService.alias$ | async).get(address) as known"
            style="display: flex; align-items: center"
            [style.marginBottom.px]="marginBottom"
        >
            <!-- JUNGLE TV -->
            <img
                *ngIf="known.socialMedia === 'jungletv'"
                src="assets/icons/social-media/jtv.png"
                class="social-media-icon"
                style="margin-right: 8px"
            />

            <!-- Twitter -->
            <button
                mat-icon-button
                disableRipple
                class="social-media-button"
                *ngIf="known.socialMedia === 'twitter'"
                (click)="copyPlatformUserId()"
            >
                <img
                    *ngIf="!showCopiedPlatformIdIcon"
                    src="assets/icons/social-media/twitter.svg"
                    class="social-media-icon"
                />
                <mat-icon style="font-size: 16px" *ngIf="showCopiedPlatformIdIcon">check_circle</mat-icon>
            </button>

            <!-- Discord -->
            <button
                mat-icon-button
                disableRipple
                class="social-media-button"
                *ngIf="known.socialMedia === 'discord'"
                (click)="copyPlatformUserId()"
            >
                <img
                    *ngIf="!showCopiedPlatformIdIcon"
                    src="assets/icons/social-media/discord.svg"
                    class="social-media-icon"
                />
                <mat-icon style="font-size: 16px" *ngIf="showCopiedPlatformIdIcon">check_circle</mat-icon>
            </button>

            <!-- Telegram -->
            <button
                mat-icon-button
                disableRipple
                class="social-media-button"
                *ngIf="known.socialMedia === 'telegram'"
                (click)="copyPlatformUserId()"
            >
                <img
                    *ngIf="!showCopiedPlatformIdIcon"
                    src="assets/icons/social-media/telegram.svg"
                    class="social-media-icon"
                />
                <mat-icon style="font-size: 16px" *ngIf="showCopiedPlatformIdIcon">check_circle</mat-icon>
            </button>

            <a
                style="font-weight: 600; line-height: 18px"
                class="link text primary alias"
                [routerLink]="'/' + navItems.account.route + '/' + address"
            >
                <ng-container *ngIf="known.socialMedia === 'discord'"> ID: </ng-container>

                {{ known.alias }}
            </a>
        </div>
    `,
})
export class AliasComponent {
    @Input() address: string;
    @Input() marginBottom: number = 0;

    navItems = APP_NAV_ITEMS;
    showCopiedPlatformIdIcon: boolean;

    constructor(
        public vp: ViewportService,
        public aliasService: AliasService,
        private readonly _ref: ChangeDetectorRef
    ) {
        this.vp.vpChange.subscribe(() => {
            this._ref.detectChanges();
        });
    }

    ngOnInit(): void {
        this.aliasService.getAlias(this.address);
    }

    copyPlatformUserId(): void {
        const platformId = this.aliasService.getSocialMediaUserId(this.address);
        void navigator.clipboard.writeText(String(platformId));
        this.showCopiedPlatformIdIcon = true;
        setTimeout(() => {
            this.showCopiedPlatformIdIcon = false;
            this._ref.detectChanges();
        }, 500);
    }
}
