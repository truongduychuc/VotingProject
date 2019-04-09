import {NgModule } from '@angular/core';
import {CreateUserFormComponent} from "./create-user-form/create-user-form.component";
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {ChangePasswordFormComponent} from "./change-password-form/change-password-form.component";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {DataTrackingComponent} from "./data-tracking/data-tracking.component";
import {DashboardComponent} from "./dashboard.component";

const dashboardRoutes: Routes = [
  { path: '', component: DashboardComponent, children: [
      {path: '', redirectTo: 'data-tracking', pathMatch: 'full'},
      {path: 'data-tracking', component: DataTrackingComponent},
      {path: 'employee-list', component: EmployeeListComponent},
      {path: 'create-user', component: CreateUserFormComponent},
      {path: 'change-password', component: ChangePasswordFormComponent}
    ]}
];
@NgModule({
  declarations: [],
  imports: [ // , if you have a residual comma here, or a double comma somewhere, you will receiver an undefined value of DashboardRouting
    CommonModule,
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
