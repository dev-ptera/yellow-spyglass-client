import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnownAccountsComponent } from '@app/pages/known-accounts/known-accounts.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AppCommonModule } from '@app/common/app-common.module';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    declarations: [KnownAccountsComponent],
    imports: [
        AppCommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        CommonModule,
        MatTableModule,
        MatSortModule,
        RouterModule,
        MatIconModule,
        MatChipsModule,
        TranslocoModule,
    ],
    exports: [KnownAccountsComponent],
})
export class KnownAccountsModule {}
