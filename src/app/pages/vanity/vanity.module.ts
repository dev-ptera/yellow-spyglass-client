import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '@app/common/app-common.module';
import { MatCardModule } from '@angular/material/card';
import { VanityComponent } from '@app/pages/vanity/vanity.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [VanityComponent],
    imports: [CommonModule, AppCommonModule, MatCardModule, RouterModule],
    exports: [VanityComponent],
})
export class VanityModule {}
