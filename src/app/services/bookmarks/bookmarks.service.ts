import { Injectable } from '@angular/core';
import { Bookmark } from '@app/types/modal';

@Injectable({
    providedIn: 'root',
})
export class BookmarksService {
    bookmarkId = 'YELLOW_SPYGLASS_BOOKMARKS'; /* Legacy - Keep it. */
    bookmarkMap: Map<string, Bookmark> = new Map();

    /** Reads the bookmarks array from localStorage and parses it into a Bookmark[] */
    private _parseLocalStorage(): Bookmark[] {
        const bookmarks = localStorage.getItem(this.bookmarkId) || '[]';
        return JSON.parse(bookmarks);
    }

    /** Rewrites local storage using values stored in the bookmarkMap */
    private _setBookmarksToLocalStorage(): void {
        localStorage.removeItem(this.bookmarkId);
        localStorage.setItem(this.bookmarkId, JSON.stringify(Array.from(this.bookmarkMap.values())));
    }

    /** This is called to refresh the bookmark map by reading what's written in local storage.
     *  This should be called whenever the BookmarksService gets or edits what's in localstorage.
     *  Reason why: Multiple tabs open at the same time become out of sync if not refreshing the data before making edits.
     * */
    private _readLocalStorage(): void {
        const bm = this._parseLocalStorage();
        this.bookmarkMap.clear();
        for (const bookmark of bm) {
            this.bookmarkMap.set(bookmark.id, bookmark);
        }
    }

    getBookmarks(): Bookmark[] {
        this._readLocalStorage();
        return Array.from(this.bookmarkMap.values()).sort((a: Bookmark, b: Bookmark) => {
            const textA = a.id.toUpperCase();
            const textB = b.id.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
    }

    hasBookmark(id: string): boolean {
        return this.bookmarkMap.has(id);
    }

    addBookmark(bookmark: Bookmark): void {
        this._readLocalStorage();
        this.bookmarkMap.set(bookmark.id, bookmark);
        this._setBookmarksToLocalStorage();
    }

    removeBookmark(id: string): void {
        this._readLocalStorage();
        this.bookmarkMap.delete(id);
        this._setBookmarksToLocalStorage();
    }
}
