import { Component } from '@angular/core';

@Component({
    selector: 'app-user-menu',
    template: `
        <pxb-user-menu [avatarValue]="avatarValue" [(open)]="open">
            <mat-nav-list pxb-menu-body [style.paddingTop.px]="0">
                <pxb-info-list-item *ngFor="let item of items" [dense]="true" (click)="open = false">
                    <mat-icon pxb-icon>{{ item.icon }}</mat-icon>
                    <div pxb-title>{{ item.title }}</div>
                </pxb-info-list-item>
            </mat-nav-list>
        </pxb-user-menu>
    `,
})
export class UserMenuComponent {
    open: false;
    avatarValue = 'AV';
    items = [
        {
            title: 'Settings',
            icon: 'settings',
        },
        {
            title: 'Contact Us',
            icon: 'mail',
        },
        {
            title: 'Log Out',
            icon: 'logout',
        },
    ];
}
