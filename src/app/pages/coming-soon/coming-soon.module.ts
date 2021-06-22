import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateModule } from '@pxblue/angular-components';
import { ComingSoonComponent } from '@app/pages/coming-soon/coming-soon.component';
import { MatIconModule } from '@angular/material/icon';
import { AppCommonModule } from '@app/common/app-common.module';

@NgModule({
    declarations: [ComingSoonComponent],
    imports: [AppCommonModule, CommonModule, EmptyStateModule, MatIconModule],
    exports: [ComingSoonComponent],
})
export class ComingSoonModule {}
