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
import { LargeRepTableComponent } from '@app/pages/representatives/display/large-rep-table/large-rep-table.component';
import { LargeRepCardsComponent } from '@app/pages/representatives/display/large-rep-cards/large-rep-cards.component';
import {MonitoredRepTableComponent} from "@app/pages/representatives/display/monitored-rep-table/monitored-rep-table.component";
import {MonitoredRepListComponent} from "@app/pages/representatives/display/monitored-rep-list/monitored-rep-list.component";

@NgModule({
    declarations: [RepresentativesComponent, LargeRepTableComponent, LargeRepCardsComponent,MonitoredRepListComponent, MonitoredRepTableComponent],
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
    exports: [RepresentativesComponent, LargeRepTableComponent, LargeRepCardsComponent,MonitoredRepListComponent, MonitoredRepTableComponent],
})
export class RepresentativesModule {}
