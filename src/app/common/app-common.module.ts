import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { EmptyStateModule, SpacerModule } from '@brightlayer-ui/angular-components';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ResponsiveDirective } from '@app/common/directives/responsive.directive';
import { SafeHtmlPipe } from '@app/common/pipes/safe.pipe';
import { ErrorComponent } from '@app/common/components/error/error.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommaPipe } from '@app/common/pipes/comma.directive';
import { PercentagePipe } from '@app/common/pipes/percentage.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CopyButtonComponent } from '@app/common/components/copy-button/copy-button.component';
import { BookmarkButtonComponent } from '@app/common/components/bookmark-button/bookmark-button.component';
import { ColorAddressPipe } from '@app/common/pipes/color-address.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LittleDecimalPipe } from '@app/common/pipes/little-decimal.pipe';
import { LoadSpinnerComponent } from '@app/common/components/load-spinner/load-spinner.component';
import { AliasComponent } from '@app/common/components/alias/alias.component';
import { RouterLinkWithHref } from '@angular/router';
import { TxFeePipe } from '@app/common/pipes/tx-fee.pipe';

@NgModule({
    declarations: [
        TxFeePipe,
        BookmarkButtonComponent,
        CommaPipe,
        CopyButtonComponent,
        ErrorComponent,
        PercentagePipe,
        ResponsiveDirective,
        SafeHtmlPipe,
        ColorAddressPipe,
        LittleDecimalPipe,
        LoadSpinnerComponent,
        AliasComponent,
    ],
    imports: [
        CommonModule,
        EmptyStateModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        SpacerModule,
        MatTooltipModule,
        RouterLinkWithHref,
    ],
    exports: [
        TxFeePipe,
        BookmarkButtonComponent,
        CommaPipe,
        CopyButtonComponent,
        ErrorComponent,
        PercentagePipe,
        ResponsiveDirective,
        SafeHtmlPipe,
        ColorAddressPipe,
        LittleDecimalPipe,
        LoadSpinnerComponent,
        AliasComponent,
    ],
})
export class AppCommonModule {}
