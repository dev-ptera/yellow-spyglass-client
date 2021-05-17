import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_NAV_ITEMS } from './navigation/nav-items';
import { ExploreComponent } from './pages/explore/explore.component';
import {ComingSoonComponent} from "./pages/coming-soon/coming-soon.component";

const routes: Routes = [
    { path: '', redirectTo: APP_NAV_ITEMS.search.route, pathMatch: 'full' },
    { path: APP_NAV_ITEMS.search.route, component: ExploreComponent },
    { path: 'coming-soon', component: ComingSoonComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
