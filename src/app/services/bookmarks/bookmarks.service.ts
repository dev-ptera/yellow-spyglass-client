import { Injectable } from '@angular/core';
import { Bookmark } from '@app/types/modal';

@Injectable({
    providedIn: 'root',
})
export class BookmarksService {
    bookmarkId = 'YELLOW_SPYGLASS_BOOKMARKS';

    bookmarkMap: Map<string, Bookmark> = new Map();

    constructor() {
        const bm = this._getBookmarksFromLocalStorage();
        for (const bookmark of bm) {
            this.bookmarkMap.set(bookmark.id, bookmark);
        }
    }

    private _getBookmarksFromLocalStorage(): Bookmark[] {
        const bookmarks = localStorage.getItem(this.bookmarkId) || '[]';
        return JSON.parse(bookmarks);
    }

    private _setBookmarksToLocalStorage(): void {
        localStorage.removeItem(this.bookmarkId);
        localStorage.setItem(this.bookmarkId, JSON.stringify(this.getBookmarks()));
    }

    getBookmarks(): Bookmark[] {
        return Array.from(this.bookmarkMap.values()).sort((a: Bookmark, b: Bookmark) => {
            const textA = a.id.toUpperCase();
            const textB = b.id.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
    }

    addBookmark(bookmark: Bookmark): void {
        this.bookmarkMap.set(bookmark.id, bookmark);
        this._setBookmarksToLocalStorage();
    }

    hasBookmark(id: string): boolean {
        return this.bookmarkMap.has(id);
    }

    removeBookmark(id: string): void {
        this.bookmarkMap.delete(id);
        this._setBookmarksToLocalStorage();
    }
}
