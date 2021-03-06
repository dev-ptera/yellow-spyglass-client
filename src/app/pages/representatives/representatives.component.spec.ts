import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentativesComponent } from './representatives.component';
import { RepresentativesModule } from '@app/pages/representatives/representatives.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RepresentativesComponent', () => {
    let component: RepresentativesComponent;
    let fixture: ComponentFixture<RepresentativesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RepresentativesModule, HttpClientTestingModule],
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
