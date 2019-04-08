import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import {CreateUserFormComponent} from './create-user-form/create-user-form.component';
import { LoginFormComponent} from './login-form/login-form.component';
import {AuthenticationGuard} from "./_guards/authentication.guard";
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {ChangePasswordFormComponent} from "./change-password-form/change-password-form.component";
import {DefaultComponent} from "./default/default.component";

const routes: Routes = [
  { path: '', redirectTo: '/default', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
  { path: 'create-user', component: CreateUserFormComponent},
  { path: 'login', component: LoginFormComponent},
  { path: 'employee-list', component: EmployeeListComponent},
  { path: 'change-password', component: ChangePasswordFormComponent},
  { path: 'default', component: DefaultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
