import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { APP_NAV_ITEMS } from '../nav-items';
import { ThemeService } from '@app/services/theme/theme.service';

@Component({
    selector: 'app-user-menu',
    template: `
        <pxb-user-menu class="app-user-menu" menuTitle="User Settings" [(open)]="userMenuOpen">
            <mat-icon pxb-avatar>settings</mat-icon>
            <mat-nav-list pxb-menu-body [style.paddingTop.px]="0">
                <pxb-info-list-item [dense]="true" (click)="openBookmarks()">
                    <mat-icon pxb-icon>bookmarks</mat-icon>
                    <div pxb-title>Bookmarks</div>
                </pxb-info-list-item>
                <div>
                    <mat-divider></mat-divider>
                    <div style="padding: 8px 16px 8px 16px; font-weight: 600">Themes</div>
                    <mat-divider></mat-divider>
                    <pxb-info-list-item [dense]="true" (click)="toggleLightTheme()">
                        <mat-icon pxb-icon>light_mode</mat-icon>
                        <div pxb-title>Light Theme</div>
                    </pxb-info-list-item>
                    <pxb-info-list-item [dense]="true" (click)="toggleDarkTheme()">
                        <mat-icon pxb-icon>dark_mode</mat-icon>
                        <div pxb-title>Dark Theme</div>
                    </pxb-info-list-item>
                </div>
            </mat-nav-list>
        </pxb-user-menu>
    `,
    styleUrls: ['./user-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppUserMenuComponent {
    userMenuOpen = false;
    navItems = APP_NAV_ITEMS;

    constructor(private readonly _router: Router, private readonly _theme: ThemeService) {}

    openBookmarks(): void {
        this.userMenuOpen = false;
        void this._router.navigateByUrl(this.navItems.bookmarks.route);
    }

    toggleLightTheme(): void {
        this.userMenuOpen = false;
        this._theme.setTheme(true);
    }

    toggleDarkTheme(): void {
        this.userMenuOpen = false;
        this._theme.setTheme(false);
    }
}
