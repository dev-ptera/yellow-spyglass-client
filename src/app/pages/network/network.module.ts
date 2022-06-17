import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateModule, SpacerModule } from '@brightlayer-ui/angular-components';
import { MatIconModule } from '@angular/material/icon';
import { AppCommonModule } from '@app/common/app-common.module';
import { NetworkComponent } from '@app/pages/network/network.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { NetworkLoadingComponent } from '@app/pages/network/network-loading.component';

@NgModule({
    declarations: [NetworkComponent, NetworkLoadingComponent],
    imports: [
        AppCommonModule,
        CommonModule,
        EmptyStateModule,
        MatIconModule,

        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        EmptyStateModule,
        FlexLayoutModule,
        FormsModule,
        HighchartsChartModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatRippleModule,
        MatDividerModule,
        RouterModule,
        SpacerModule,
    ],
    exports: [NetworkComponent, NetworkLoadingComponent],
})
export class NetworkModule {}
