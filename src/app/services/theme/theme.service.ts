import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    themeLocalStorageId = 'YELLOW_SPYGLASS_THEME';

    lightMode: boolean;

    constructor() {
        this.lightMode = localStorage.getItem(this.themeLocalStorageId) !== 'dark'; // Use light by default.
        this._toggleTheme();
    }

    isLightMode(): boolean {
        return this.lightMode;
    }

    setTheme(lightMode: boolean): void {
        this.lightMode = lightMode;
        this._toggleTheme();
    }

    private _toggleTheme(): void {
        if (this.lightMode) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        }
    }
}
