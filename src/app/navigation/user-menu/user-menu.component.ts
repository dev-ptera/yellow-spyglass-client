import { Component } from '@angular/core';

@Component({
    selector: 'app-user-menu',
    template: `
        <pxb-user-menu [(open)]="open">
            <mat-icon pxb-avatar>more_vert</mat-icon>
            <mat-nav-list pxb-menu-body [style.paddingTop.px]="0">
                <pxb-info-list-item *ngFor="let item of items" [dense]="true" (click)="open = false">
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
}
