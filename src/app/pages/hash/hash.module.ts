import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashComponent } from '@app/pages/hash/hash.component';
import { AppCommonModule } from '@app/common/app-common.module';

@NgModule({
    declarations: [HashComponent],
    imports: [AppCommonModule, CommonModule],
    exports: [HashComponent],
})
export class HashModule {}
