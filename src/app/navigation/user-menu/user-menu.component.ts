import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_NAV_ITEMS } from '../nav-items';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeService } from '@app/services/theme/theme.service';
import { ViewportService } from '@app/services/viewport/viewport.service';

@Component({
    selector: 'app-user-menu',
    template: `
        <pxb-user-menu [(open)]="open">
            <mat-icon pxb-avatar>more_vert</mat-icon>
            <mat-nav-list pxb-menu-body [style.paddingTop.px]="0" [disableRipple]="true">
                <pxb-info-list-item [dense]="!vp.sm" (click)="open = false; navigate(appNavItems.bookmarks.route)">
                    <mat-icon pxb-icon>{{ appNavItems.bookmarks.icon }}</mat-icon>
                    <div pxb-title>{{ appNavItems.bookmarks.title }}</div>
                </pxb-info-list-item>
                <pxb-info-list-item style="pointer-events: none" [dense]="!vp.sm">
                    <div pxb-icon style="pointer-events: auto">
                        <mat-slide-toggle [checked]="lightMode" (change)="toggleTheme($event)">Theme</mat-slide-toggle>
                    </div>
                    <div pxb-title>Light Theme</div>
                </pxb-info-list-item>
                <!--
                <mat-expansion-panel>
                    <mat-expansion-panel-header>
                        <mat-panel-title>
                            Language
                        </mat-panel-title>
                    </mat-expansion-panel-header>
                    <p>Select Language</p>
                </mat-expansion-panel> -->
            </mat-nav-list>
        </pxb-user-menu>
    `,
    styleUrls: ['user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
    appNavItems = APP_NAV_ITEMS;
    open: false;
    lightMode: boolean;

    constructor(
        public vp: ViewportService,
        private readonly _router: Router,
        private readonly _themeService: ThemeService
    ) {}

    ngOnInit(): void {
        this.lightMode = this._themeService.isLightMode();
    }

    navigate(route: string): void {
        if (route) {
            void this._router.navigate([route]);
        }
    }

    toggleTheme(event: MatSlideToggleChange): void {
        this._themeService.setTheme(event.checked);
    }
}
