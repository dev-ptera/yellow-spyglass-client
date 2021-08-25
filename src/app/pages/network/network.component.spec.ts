import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkComponent } from './network.component';
import { NetworkModule } from '@app/pages/network/network.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('NetworkComponent', () => {
    let component: NetworkComponent;
    let fixture: ComponentFixture<NetworkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NetworkModule, RouterTestingModule],
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
