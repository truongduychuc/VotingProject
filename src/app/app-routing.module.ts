import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DefaultComponent} from "./default/default.component";
import {DashboardModule} from "./dashboard/dashboard.module";
import {AuthenticationGuard} from "./_guards/authentication.guard";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
  {path: '', redirectTo: '/start-page', pathMatch: 'full'},
  {path: 'start-page', component: DefaultComponent},
  {path: 'dashboard', loadChildren: () => DashboardModule, canActivate: [AuthenticationGuard]},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, /*{useHash: true}*/)],  // useHash: turn prefix into # sign
  exports: [RouterModule]
})
export class AppRoutingModule { }
