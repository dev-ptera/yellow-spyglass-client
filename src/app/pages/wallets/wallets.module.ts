import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@app/components/components.module';
import { WalletsComponent } from '@app/pages/wallets/wallets.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
    declarations: [WalletsComponent],
    imports: [CommonModule, ComponentsModule, HighchartsChartModule, MatBadgeModule, MatTableModule],
    exports: [WalletsComponent],
})
export class WalletsModule {}
