import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WalletsModule } from '@app/pages/wallets/wallets.module';
import { WalletsComponent } from '@app/pages/wallets/wallets.component';

describe('WalletsComponent', () => {
    let component: WalletsComponent;
    let fixture: ComponentFixture<WalletsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WalletsModule, HttpClientTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WalletsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
