import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { APP_NAV_ITEMS } from '../nav-items';
import { ThemeService } from '@app/services/theme/theme.service';

@Component({
    selector: 'app-user-menu',
    template: `
        <blui-user-menu class="app-user-menu" menuTitle="User Settings" [(open)]="userMenuOpen">
            <mat-icon blui-avatar>settings</mat-icon>
            <mat-nav-list blui-menu-body [style.paddingTop.px]="0">
                <blui-info-list-item [dense]="true" (click)="openBookmarks()">
                    <mat-icon blui-icon>bookmarks</mat-icon>
                    <div blui-title>Bookmarks</div>
                </blui-info-list-item>
                <div>
                    <mat-divider></mat-divider>
                    <div style="padding: 8px 16px 8px 16px; font-weight: 600">Themes</div>
                    <mat-divider></mat-divider>
                    <blui-info-list-item [dense]="true" (click)="toggleLightTheme()">
                        <mat-icon blui-icon>light_mode</mat-icon>
                        <div blui-title>Light Theme</div>
                    </blui-info-list-item>
                    <blui-info-list-item [dense]="true" (click)="toggleDarkTheme()">
                        <mat-icon blui-icon>dark_mode</mat-icon>
                        <div blui-title>Dark Theme</div>
                    </blui-info-list-item>
                </div>
            </mat-nav-list>
        </blui-user-menu>
    `,
    styleUrls: ['./user-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppUserMenuComponent {
    userMenuOpen = false;
    navItems = APP_NAV_ITEMS;

    constructor(
        private readonly _router: Router,
        private readonly _theme: ThemeService
    ) {}

    openBookmarks(): void {
        this.userMenuOpen = false;
        void this._router.navigateByUrl(this.navItems.bookmarks.route);
    }

    toggleLightTheme(): void {
        this.userMenuOpen = false;
        this._theme.setTheme('jungle-green');
    }

    toggleDarkTheme(): void {
        this.userMenuOpen = false;
        this._theme.setTheme('dark');
    }
}
