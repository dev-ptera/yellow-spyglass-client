import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletsComponent } from '@app/pages/wallets/wallets.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { AppCommonModule } from '@app/common/app-common.module';

@NgModule({
    declarations: [WalletsComponent],
    imports: [CommonModule, AppCommonModule, HighchartsChartModule, MatBadgeModule, MatTableModule],
    exports: [WalletsComponent],
})
export class WalletsModule {}
