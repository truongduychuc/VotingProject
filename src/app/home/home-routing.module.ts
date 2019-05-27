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
import {Role} from '../_enums/role';
import {AwardDetailComponent} from './award-management/award-detail/award-detail.component';
import {VotingBreakdownComponent} from './award-management/voting-breakdown/voting-breakdown.component';
import {SurveysComponent} from './surveys/surveys.component';
import {SurveyListComponent} from './surveys/survey-list/survey-list.component';
import {AddingNewSurveyComponent} from './surveys/adding-new-survey/adding-new-survey.component';


const homeRoutes: Routes = [
  { path: '', component: HomeComponent, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'users', component: UserManagementComponent},
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
      {path: 'awards', component: AwardManagementComponent},
      {path: 'award-detail/:id', component: AwardDetailComponent},
      {path: 'voting-breakdown/:id', component: VotingBreakdownComponent},
      {
        path: 'surveys',
        component: SurveysComponent,
        children: [
          {path: '', redirectTo: 'list'},
          {path: 'list', component: SurveyListComponent},
          {path: 'add-new', component: AddingNewSurveyComponent}
        ]}
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
