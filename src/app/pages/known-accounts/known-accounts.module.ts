import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnownAccountsComponent } from '@app/pages/known-accounts/known-accounts.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AppCommonModule } from '@app/common/app-common.module';

@NgModule({
    declarations: [KnownAccountsComponent],
    imports: [AppCommonModule, CommonModule, MatTableModule, MatSortModule],
    exports: [KnownAccountsComponent],
})
export class KnownAccountsModule {}
