import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentativesComponent } from './representatives.component';
import { AppModule } from '../../app.module';

describe('ComingSoonComponent', () => {
    let component: RepresentativesComponent;
    let fixture: ComponentFixture<RepresentativesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RepresentativesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
