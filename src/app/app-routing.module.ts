import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DefaultComponent} from "./default/default.component";
import {DashboardModule} from "./dashboard/dashboard.module";

const routes: Routes = [
  {path: '', redirectTo: '/start-page', pathMatch: 'full'},
  {path: 'start-page', component: DefaultComponent},
  {path: 'dashboard', loadChildren: () => DashboardModule},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, /*{useHash: true}*/)],  // useHash: turn prefix into # sign
  exports: [RouterModule]
})
export class AppRoutingModule { }
