import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletsComponent } from '@app/pages/wallets/wallets.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { AppCommonModule } from '@app/common/app-common.module';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [WalletsComponent],
    imports: [
        AppCommonModule,
        CommonModule,
        HighchartsChartModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        RouterModule,
    ],
    exports: [WalletsComponent],
})
export class WalletsModule {}
