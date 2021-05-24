import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-menu',
    template: `
        <pxb-user-menu [(open)]="open">
            <mat-icon pxb-avatar>more_vert</mat-icon>
            <mat-nav-list pxb-menu-body [style.paddingTop.px]="0">
                <pxb-info-list-item
                    *ngFor="let item of items"
                    [dense]="true"
                    (click)="open = false; navigate(item.route)"
                >
                    <mat-icon pxb-icon>{{ item.icon }}</mat-icon>
                    <div pxb-title>{{ item.title }}</div>
                </pxb-info-list-item>
            </mat-nav-list>
        </pxb-user-menu>
    `,
    styleUrls: ['user-menu.component.scss'],
})
export class UserMenuComponent {
    open: false;
    items = [
        {
            title: 'Bookmarks',
            icon: 'bookmarks',
            route: 'bookmarks',
        },
        {
            title: 'Theme',
            icon: 'mail',
        },
        {
            title: 'Language',
            icon: 'mail',
        },
    ];

    constructor(private _router: Router) {}

    navigate(route: string): void {
        if (route) {
            void this._router.navigate([route]);
        }
    }
}
