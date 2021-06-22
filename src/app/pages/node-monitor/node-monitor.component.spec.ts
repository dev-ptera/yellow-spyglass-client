import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NodeMonitorComponent } from '@app/pages/node-monitor/node-monitor.component';
import { NodeMonitorModule } from '@app/pages/node-monitor/node-monitor.module';

describe('NodeMonitorComponent', () => {
    let component: NodeMonitorComponent;
    let fixture: ComponentFixture<NodeMonitorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NodeMonitorModule, HttpClientTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NodeMonitorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        void expect(component).toBeTruthy();
    });
});
