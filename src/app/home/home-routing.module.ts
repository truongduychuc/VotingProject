import {NgModule } from '@angular/core';
import {CreateUserFormComponent} from "./create-user-form/create-user-form.component";
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {ChangePasswordFormComponent} from "./change-password-form/change-password-form.component";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {HomeComponent} from "./home.component";
import {PersonalInformationComponent} from "./personal-information/personal-information.component";
import {VotingComponent} from "./voting/voting.component";


const homeRoutes: Routes = [
  { path: '', component: HomeComponent, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'employee-list', component: EmployeeListComponent},
      {path: 'create-user', component: CreateUserFormComponent},
      {path: 'change-password', component: ChangePasswordFormComponent},
      {path: 'vote', component: VotingComponent},
      {path: 'personal-info', component: PersonalInformationComponent}
    ]}
];
@NgModule({
  declarations: [],
  imports: [ // , if you have a residual comma here, or a double comma somewhere, you will receiver an undefined value of DashboardRouting
    CommonModule,
    RouterModule.forChild(homeRoutes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
