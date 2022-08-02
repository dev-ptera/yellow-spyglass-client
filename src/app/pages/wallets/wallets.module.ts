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
import { WalletPaginatorComponent } from '@app/pages/wallets/paginator/paginator.component';
import { SpacerModule } from '@brightlayer-ui/angular-components';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [WalletsComponent, WalletPaginatorComponent],
    imports: [
        AppCommonModule,
        CommonModule,
        HighchartsChartModule,
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        SpacerModule,
        RouterModule,
    ],
    exports: [WalletsComponent],
})
export class WalletsModule {}
