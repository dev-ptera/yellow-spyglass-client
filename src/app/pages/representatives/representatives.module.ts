import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { InfoListItemModule, ListItemTagModule } from '@pxblue/angular-components';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppCommonModule } from '@app/common/app-common.module';
import { RepresentativesComponent } from '@app/pages/representatives/representatives.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [RepresentativesComponent],
    imports: [
        AppCommonModule,
        CommonModule,
        HighchartsChartModule,
        InfoListItemModule,
        ListItemTagModule,
        MatCardModule,
        MatTableModule,
        MatSortModule,
        MatSlideToggleModule,
        FormsModule,
    ],
    exports: [RepresentativesComponent],
})
export class RepresentativesModule {}
