import { Injectable } from '@angular/core';

export type Theme = 'jungle-green' | 'dark';

const LIGHT_THEME = 'jungle-green';
const DARK_THEME = 'dark';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    themeLocalStorageId = 'YELLOW_SPYGLASS_THEME';
    currentTheme: Theme;

    constructor() {
        this.currentTheme = localStorage.getItem(this.themeLocalStorageId) as Theme;
        // Use light theme by default.
        if (this.currentTheme !== DARK_THEME) {
            this.currentTheme = LIGHT_THEME;
        }
        this.setTheme(this.currentTheme);
    }

    isLightMode(): boolean {
        return this.currentTheme === LIGHT_THEME;
    }

    isDarkMode(): boolean {
        return this.currentTheme === DARK_THEME;
    }

    setTheme(newTheme: Theme): void {
        this.currentTheme = newTheme;
        document.body.classList.remove('jungle-green');
        document.body.classList.remove('dark');
        document.body.classList.add(newTheme);
        setTimeout(() => {
            localStorage.setItem(this.themeLocalStorageId, newTheme);
        });
    }
}
