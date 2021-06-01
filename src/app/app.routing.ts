import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_NAV_ITEMS } from './navigation/nav-items';
import { ExploreComponent } from './pages/explore/explore.component';
import { BookmarksComponent } from '@app/pages/bookmarks/bookmarks.component';
import { ComingSoonComponent } from '@app/pages/coming-soon/coming-soon.component';
import { RepresentativesComponent } from '@app/pages/representatives/representatives.component';

const routes: Routes = [
    { path: '', redirectTo: APP_NAV_ITEMS.search.route, pathMatch: 'full' },
    { path: APP_NAV_ITEMS.search.route, component: ExploreComponent },
    { path: APP_NAV_ITEMS.representatives.route, component: RepresentativesComponent },
    { path: APP_NAV_ITEMS.bookmarks.route, component: BookmarksComponent },
    { path: 'coming-soon', component: ComingSoonComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
