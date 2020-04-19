import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from './default/default.component';
import {AuthenticationGuard} from './_guards/authentication.guard';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', redirectTo: '/start-page', pathMatch: 'full'},
  {path: 'start-page', component: DefaultComponent},
  // @ts-ignore
  {path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [AuthenticationGuard]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
