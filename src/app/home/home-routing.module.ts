import {NgModule} from '@angular/core';
import {UserManagementComponent} from './user-management/user-management.component';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomeComponent} from './home.component';
import {PersonalInformationComponent} from './personal-information/personal-information.component';
import {VotingComponent} from './voting/voting.component';
import {AwardManagementComponent} from './award-management/award-management.component';
import {RoleGuard} from '../_guards/role.guard';
import {RoleID} from '../_enums/role';
import {AwardDetailComponent} from './award-management/award-detail/award-detail.component';
import {VotingBreakdownComponent} from './award-management/voting-breakdown/voting-breakdown.component';
import {ScoreTableComponent} from './award-management/voting-breakdown/score-table/score-table.component';
import {CurrentChartComponent} from './award-management/voting-breakdown/current-chart/current-chart.component';


const homeRoutes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'users', component: UserManagementComponent},
      {
        path: 'vote',
        component: VotingComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            RoleID.ENGINEER,
            RoleID.MANAGER
          ]
        }
      },
      {
        path: 'personal-info',
        component: PersonalInformationComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            RoleID.ENGINEER,
            RoleID.MANAGER
          ]
        }
      },
      {path: 'awards', component: AwardManagementComponent},
      {path: 'award-detail/:id', component: AwardDetailComponent},
      {
        path: 'voting-breakdown/:id',
        component: VotingBreakdownComponent,
        children: [
          {path: '', redirectTo: 'score-table'},
          {path: 'score-table', component: ScoreTableComponent},
          {path: 'chart', component: CurrentChartComponent}
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [ // , if you have a residual comma here, or a double comma somewhere, you will receiver an undefined value of DashboardRouting
    CommonModule,
    RouterModule.forChild(homeRoutes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
