import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppCommonModule } from '@app/common/app-common.module';
import { HomeComponent } from '@app/pages/home/home.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [HomeComponent],
    imports: [
        AppCommonModule,
        BrowserAnimationsModule,
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
    exports: [HomeComponent],
})
export class HomeModule {}
