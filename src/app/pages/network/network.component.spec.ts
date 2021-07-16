import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkComponent } from './network.component';
import { ComingSoonModule } from '@app/pages/coming-soon/coming-soon.module';

describe('ComingSoonComponent', () => {
    let component: NetworkComponent;
    let fixture: ComponentFixture<NetworkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ComingSoonModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NetworkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
