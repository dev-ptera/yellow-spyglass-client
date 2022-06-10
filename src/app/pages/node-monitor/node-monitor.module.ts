import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeMonitorComponent } from '@app/pages/node-monitor/node-monitor.component';
import { AppCommonModule } from '@app/common/app-common.module';
import { InfoListItemModule } from '@brightlayer-ui/angular-components';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [NodeMonitorComponent],
    imports: [AppCommonModule, CommonModule, InfoListItemModule, MatListModule, MatCardModule, RouterModule],
    exports: [NodeMonitorComponent],
})
export class NodeMonitorModule {}
