import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnownAccountsComponent } from '@app/pages/known-accounts/known-accounts.component';
import { KnownAccountsModule } from '@app/pages/known-accounts/known-accounts.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('KnownAccountsComponent', () => {
    let component: KnownAccountsComponent;
    let fixture: ComponentFixture<KnownAccountsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KnownAccountsModule, HttpClientTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(KnownAccountsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
