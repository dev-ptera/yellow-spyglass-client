import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookmarksComponent } from '@app/pages/bookmarks/bookmarks.component';
import { BookmarksModule } from '@app/pages/bookmarks/bookmarks.module';

describe('BookmarksComponent', () => {
    let component: BookmarksComponent;
    let fixture: ComponentFixture<BookmarksComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BookmarksModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BookmarksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
