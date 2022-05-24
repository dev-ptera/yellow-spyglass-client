import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { InfoListItemModule, ListItemTagModule, UserMenuModule } from '@brightlayer-ui/angular-components';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppCommonModule } from '@app/common/app-common.module';
import { RepresentativesComponent } from '@app/pages/representatives/representatives.component';
import { FormsModule } from '@angular/forms';
import { LargeRepTableComponent } from '@app/pages/representatives/display/large-rep-table/large-rep-table.component';
import { LargeRepCardsComponent } from '@app/pages/representatives/display/large-rep-cards/large-rep-cards.component';
import { MonitoredRepTableComponent } from '@app/pages/representatives/display/monitored-rep-table/monitored-rep-table.component';
import { MonitoredRepListComponent } from '@app/pages/representatives/display/monitored-rep-list/monitored-rep-list.component';
import { WeightChartComponent } from '@app/pages/representatives/display/weight-chart/weight-chart.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UptimeMetricComponent } from '@app/pages/representatives/display/metrics/uptime-metric/uptime-metric.component';
import { ScoreMetricComponent } from '@app/pages/representatives/display/metrics/score-metric/score-metric.component';
import {MicroRepListComponent} from "@app/pages/representatives/display/micro-rep-list/micro-rep-list.component";

@NgModule({
    declarations: [
        RepresentativesComponent,
        LargeRepTableComponent,
        LargeRepCardsComponent,
        MonitoredRepListComponent,
        MonitoredRepTableComponent,
        WeightChartComponent,
        ScoreMetricComponent,
        UptimeMetricComponent,
        MicroRepListComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        HighchartsChartModule,
        InfoListItemModule,
        ListItemTagModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatSortModule,
        MatSlideToggleModule,
        FormsModule,
        UserMenuModule,
        MatCheckboxModule,
        RouterModule,
        MatMenuModule,
    ],
    exports: [
        RepresentativesComponent,
        LargeRepTableComponent,
        LargeRepCardsComponent,
        MonitoredRepListComponent,
        MonitoredRepTableComponent,
        WeightChartComponent,
        ScoreMetricComponent,
        UptimeMetricComponent,
        MicroRepListComponent
    ],
})
export class RepresentativesModule {}
