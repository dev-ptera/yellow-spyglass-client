import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnownAccountsComponent } from '@app/pages/known-accounts/known-accounts.component';
import { MatTableModule } from '@angular/material/table';
import { ComponentsModule } from '@app/components/components.module';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
    declarations: [KnownAccountsComponent],
    imports: [CommonModule, ComponentsModule, MatTableModule, MatSortModule],
    exports: [KnownAccountsComponent],
})
export class KnownAccountsModule {}
