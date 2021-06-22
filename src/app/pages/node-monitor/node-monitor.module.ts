import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeMonitorComponent } from '@app/pages/node-monitor/node-monitor.component';

@NgModule({
    declarations: [NodeMonitorComponent],
    imports: [CommonModule],
    exports: [NodeMonitorComponent],
})
export class NodeMonitorModule {}
