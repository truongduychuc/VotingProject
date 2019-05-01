import {NgModule} from '@angular/core';
import {EmployeeListComponent} from './employee-list/employee-list.component';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomeComponent} from './home.component';
import {PersonalInformationComponent} from './personal-information/personal-information.component';
import {VotingComponent} from './voting/voting.component';
import {AwardListComponent} from './award-list/award-list.component';
import {RoleGuard} from '../_guards/role.guard';
import {Role} from '../_enums/role';
import {AwardDetailComponent} from "./award-list/award-detail/award-detail.component";


const homeRoutes: Routes = [
  { path: '', component: HomeComponent, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'employee-list', component: EmployeeListComponent},
      {path: 'vote',
        component: VotingComponent,
        canActivate: [RoleGuard],
        data: {
        roles: [Role.MANAGER, Role.DEVELOPER]}
        },
      {path: 'personal-info',
        component: PersonalInformationComponent,
        canActivate: [RoleGuard],
        data: {
        roles: [Role.MANAGER, Role.DEVELOPER]
      }
      },
      {path: 'award-list',component: AwardListComponent},
      {path: 'award-detail/:id', component: AwardDetailComponent}
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
