import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppCommonModule } from '@app/common/app-common.module';
import { HomeComponent } from '@app/pages/home/home.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NavigationModule } from '../../navigation/navigation.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Translation, TRANSLOCO_LOADER, TranslocoLoader, TranslocoModule } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeTranlsocoLoader implements TranslocoLoader {
    constructor(private readonly _http: HttpClient) {}

    getTranslation(lang: string): Observable<Translation> {
        return this._http.get<Translation>(`/assets/i18n/home/${lang}.json`);
    }
}

@NgModule({
    declarations: [HomeComponent],
    imports: [
        AppCommonModule,
        NavigationModule,
        BrowserAnimationsModule,
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        FormsModule,
        RouterModule,
        TranslocoModule,
    ],
    providers: [{ provide: TRANSLOCO_LOADER, useClass: HomeTranlsocoLoader }],
    exports: [HomeComponent],
})
export class HomeModule {}
