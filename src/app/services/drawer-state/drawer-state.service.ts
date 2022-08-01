import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawerStateService {
    private drawerOpen = false;
    private selectedItem: string;

    setDrawerOpen(drawerOpen: boolean): void {
        document.body.style.overflow = drawerOpen ? 'hidden' : 'auto'; // Fight content scroll on drawer open.
        this.drawerOpen = drawerOpen;
    }

    getDrawerOpen(): boolean {
        return this.drawerOpen;
    }

    setSelectedItem(item: string): void {
        this.selectedItem = item;
    }

    getSelectedItem(): string {
        return this.selectedItem;
    }
}
