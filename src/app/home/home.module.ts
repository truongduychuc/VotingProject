import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import {ChangePasswordModalComponent} from './change-password-modal/change-password-modal.component';
import {CreatingUserModalComponent} from './user-management/creating-user-modal/creating-user-modal.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeRoutingModule} from './home-routing.module';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {NgbActiveModal, NgbDateNativeAdapter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PersonalInformationComponent } from './personal-information/personal-information.component';
import {VotingComponent } from './voting/voting.component';
import { EditingModalComponent } from './user-management/editing-modal/editing-modal.component';
import { AwardManagementComponent } from './award-management/award-management.component';
import { AwardAsYearComponent } from './award-management/award-as-year/award-as-year.component';
import { AwardComponent } from './award-management/award/award.component';
import { AddAwardModalComponent } from './award-management/add-award-modal/add-award-modal.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { UploadAvatarComponent } from './upload-avatar/upload-avatar.component';
import {GroupByPipe} from '../_pipes/group-by.pipe';
import { AwardDetailComponent } from './award-management/award-detail/award-detail.component';
import { UploadLogoComponent } from './award-management/upload-logo/upload-logo.component';
import { EditingAwardModalComponent } from './award-management/editing-award-modal/editing-award-modal.component';
import { VotingBreakdownComponent } from './award-management/voting-breakdown/voting-breakdown.component';
import {DateFormatPipe} from '../_pipes/date-format.pipe';
import {DatetimeFormatPipe} from '../_pipes/datetime-format.pipe';
import {ConfirmModalComponent} from '../modals/confirm-modal/confirm-modal.component';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {CarouselModule} from 'ngx-owl-carousel-o';
import { SurveysComponent } from './surveys/surveys.component';
import { AddingNewSurveyComponent } from './surveys/adding-new-survey/adding-new-survey.component';
import { SurveyListComponent } from './surveys/survey-list/survey-list.component';
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 1
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};
@NgModule({
  declarations: [
    ChangePasswordModalComponent,
    CreatingUserModalComponent,
    UserManagementComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    HomeComponent,
    PersonalInformationComponent,
    VotingComponent,
    EditingModalComponent,
    AwardManagementComponent,
    AwardAsYearComponent,
    AwardComponent,
    AddAwardModalComponent,
    UploadAvatarComponent,
    GroupByPipe,
    AwardDetailComponent,
    UploadLogoComponent,
    EditingAwardModalComponent,
    VotingBreakdownComponent,
    DateFormatPipe,
    DatetimeFormatPipe,
    ConfirmModalComponent,
    SurveysComponent,
    AddingNewSurveyComponent,
    SurveyListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    HomeRoutingModule,
    NgbModule,
    NgSelectModule,
    NotifierModule.withConfig(customNotifierOptions),
    CarouselModule
  ],
  providers: [
    NgbActiveModal,
    NgbDateNativeAdapter
  ],
  entryComponents: [
    EditingModalComponent,
    CreatingUserModalComponent,
    AddAwardModalComponent,
    ChangePasswordModalComponent,
    UploadAvatarComponent,
    UploadLogoComponent,
    ConfirmModalComponent
  ]
})
export class HomeModule { }
