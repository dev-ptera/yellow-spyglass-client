import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeMonitorComponent } from '@app/pages/node-monitor/node-monitor.component';
import { AppCommonModule } from '@app/common/app-common.module';

@NgModule({
    declarations: [NodeMonitorComponent],
    imports: [AppCommonModule, CommonModule],
    exports: [NodeMonitorComponent],
})
export class NodeMonitorModule {}
