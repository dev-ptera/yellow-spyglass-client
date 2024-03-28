import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockComponent } from '@app/pages/block/block.component';
import { AppCommonModule } from '@app/common/app-common.module';
import { RouterModule } from '@angular/router';
import { EmptyStateModule } from '@brightlayer-ui/angular-components';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    declarations: [BlockComponent],
    imports: [
        AppCommonModule,
        CommonModule,
        RouterModule,
        EmptyStateModule,
        MatButtonModule,
        MatIconModule,
        TranslocoModule,
    ],
    exports: [BlockComponent],
})
export class BlockModule {}
