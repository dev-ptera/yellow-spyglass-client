import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    themeLocalStorageId = 'YELLOW_SPYGLASS_THEME';
    currentTheme: Theme;

    constructor() {
        this.currentTheme = localStorage.getItem(this.themeLocalStorageId) as Theme;
        // Use dark theme by default.
        if (this.currentTheme !== LIGHT_THEME) {
            this.currentTheme = DARK_THEME;
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
        document.body.classList.remove('light');
        document.body.classList.remove('dark');
        document.body.classList.add(newTheme);
        setTimeout(() => {
            localStorage.setItem(this.themeLocalStorageId, newTheme);
        });
    }
}
