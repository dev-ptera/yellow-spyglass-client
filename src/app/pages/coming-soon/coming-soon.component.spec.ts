import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingSoonComponent } from './coming-soon.component';
import { ComingSoonModule } from '@app/pages/coming-soon/coming-soon.module';

describe('ComingSoonComponent', () => {
    let component: ComingSoonComponent;
    let fixture: ComponentFixture<ComingSoonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ComingSoonModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ComingSoonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
