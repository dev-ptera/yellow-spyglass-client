import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    EmptyStateModule,
    InfoListItemModule,
    ListItemTagModule,
    UserMenuModule,
} from '@brightlayer-ui/angular-components';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppCommonModule } from '@app/common/app-common.module';
import { AccountComponent } from '@app/pages/account/account.component';
import { DelegatorsTabComponent } from '@app/pages/account/tabs/delegators/delegators-tab.components';
import { InsightsTabComponent } from '@app/pages/account/tabs/insights/insights-tab.components';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NftsTabComponents } from '@app/pages/account/tabs/nfts/nfts-tab.components';
import { AccountActionsMenuComponent } from '@app/pages/account/account-actions-menu/account-actions-menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CsvButtonComponent } from '@app/pages/account/action-buttons/csv-button/csv-button.component';
import { FilterButtonComponent } from '@app/pages/account/action-buttons/filter-button/filter-button.component';
import { QrButtonComponent } from '@app/pages/account/action-buttons/qr-button/qr-button.component';
import { FilterDrawerComponent } from '@app/pages/account/filter-drawer/filter-drawer.component';
import { QrDialogComponent } from '@app/pages/account/qr-dialog/qr-dialog.component';
import { CasualViewComponent } from '@app/pages/account/tabs/transaction/casual-view/casual-view.component';
import { CompactViewComponent } from '@app/pages/account/tabs/transaction/compact-view/compact-view.component';
import { TransactionTabComponent } from './tabs/transaction/transaction-tab.component';
import { TxPaginatorComponent } from '@app/pages/account/tabs/transaction/paginator/paginator.component';
import { MatTableModule } from '@angular/material/table';
import { ViewButtonComponent } from '@app/pages/account/action-buttons/view-button/view-button.component';

@NgModule({
    declarations: [
        AccountComponent,
        AccountActionsMenuComponent,
        CasualViewComponent,
        CompactViewComponent,
        CsvButtonComponent,
        DelegatorsTabComponent,
        FilterButtonComponent,
        FilterDrawerComponent,
        InsightsTabComponent,
        NftsTabComponents,
        QrButtonComponent,
        ViewButtonComponent,
        QrDialogComponent,
        TransactionTabComponent,
        TxPaginatorComponent,
    ],
    imports: [
        AppCommonModule,
        BrowserAnimationsModule,
        CommonModule,
        EmptyStateModule,
        FormsModule,
        InfoListItemModule,
        ListItemTagModule,
        MatExpansionModule,
        MatChipsModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatSliderModule,
        MatTabsModule,
        MatTableModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RouterModule,
        UserMenuModule,
    ],
    entryComponents: [QrDialogComponent],
})
export class AccountModule {}
