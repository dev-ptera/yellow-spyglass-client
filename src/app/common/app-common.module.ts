import { NgModule } from '@angular/core';
import { ComponentsModule } from './components/components.module';
import { SafeHtmlPipe } from '@app/common/pipes/safe.pipe';
import { ResponsiveDirective } from '@app/common/directives/responsive.directive';

@NgModule({
    declarations: [SafeHtmlPipe, ResponsiveDirective],
    imports: [ComponentsModule],
    exports: [SafeHtmlPipe, ResponsiveDirective, ComponentsModule],
})
export class AppCommonModule {}
