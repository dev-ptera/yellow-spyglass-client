import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VanityComponent } from '@app/pages/vanity/vanity.component';
import { VanityModule } from '@app/pages/vanity/vanity.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('VanityComponent', () => {
    let component: VanityComponent;
    let fixture: ComponentFixture<VanityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VanityModule, HttpClientTestingModule, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VanityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
