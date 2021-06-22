import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { RepresentativesComponent } from '@app/pages/representatives/representatives.component';
import { InfoListItemModule } from '@pxblue/angular-components';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppCommonModule } from '@app/common/app-common.module';

@NgModule({
    declarations: [RepresentativesComponent],
    imports: [CommonModule, AppCommonModule, HighchartsChartModule, InfoListItemModule, MatSortModule, MatTableModule],
    exports: [RepresentativesComponent],
})
export class RepresentativesModule {}
