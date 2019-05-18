import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import {ChangePasswordModalComponent} from './change-password-modal/change-password-modal.component';
import {CreatingUserModalComponent} from './employee-management/creating-user-modal/creating-user-modal.component';
import {EmployeeManagementComponent} from './employee-management/employee-management.component';
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
import { EditingModalComponent } from './employee-management/editing-modal/editing-modal.component';
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
import {NotifierModule} from 'angular-notifier';

@NgModule({
  declarations: [
    ChangePasswordModalComponent,
    CreatingUserModalComponent,
    EmployeeManagementComponent,
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
    DatetimeFormatPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    HomeRoutingModule,
    NgbModule,
    NgSelectModule,
    NotifierModule
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
    UploadLogoComponent
  ]
})
export class HomeModule { }
