import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '@app/common/app-common.module';
import { MatCardModule } from '@angular/material/card';
import { VanityComponent } from '@app/pages/vanity/vanity.component';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    declarations: [VanityComponent],
    imports: [CommonModule, AppCommonModule, MatCardModule, RouterModule, TranslocoModule],
    exports: [VanityComponent],
})
export class VanityModule {}
