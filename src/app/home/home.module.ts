import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import {ChangePasswordModalComponent} from "./change-password-modal/change-password-modal.component";
import {CreateUserModalComponent} from "./employee-list/create-user-modal/create-user-modal.component";
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {FooterComponent} from "./footer/footer.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {DashboardComponent } from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HomeRoutingModule} from "./home-routing.module";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "./home.component";
import {NgbActiveModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {PersonalInformationComponent } from './personal-information/personal-information.component';
import {VotingComponent } from './voting/voting.component';
import { EditingModalComponent } from './employee-list/editing-modal/editing-modal.component';
import { AwardListComponent } from './award-list/award-list.component';
import { AwardAsYearComponent } from './award-list/award-as-year/award-as-year.component';
import { AwardComponent } from './award-list/award/award.component';
import { AddAwardModalComponent } from './award-list/add-award-modal/add-award-modal.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { UploadAvatarComponent } from './upload-avatar/upload-avatar.component';
import {GroupByPipe} from "../_pipes/group-by.pipe";
import { AwardDetailComponent } from './award-list/award-detail/award-detail.component';
import { UploadLogoComponent } from './award-list/upload-logo/upload-logo.component';

@NgModule({
  declarations: [
    ChangePasswordModalComponent,
    CreateUserModalComponent,
    EmployeeListComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    HomeComponent,
    PersonalInformationComponent,
    VotingComponent,
    EditingModalComponent,
    AwardListComponent,
    AwardAsYearComponent,
    AwardComponent,
    AddAwardModalComponent,
    UploadAvatarComponent,
    GroupByPipe,
    AwardDetailComponent,
    UploadLogoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    HomeRoutingModule,
    NgbModule,
    NgSelectModule
  ],
  providers: [
    NgbActiveModal
  ],
  entryComponents: [
    EditingModalComponent,
    CreateUserModalComponent,
    AddAwardModalComponent,
    ChangePasswordModalComponent,
    UploadAvatarComponent,
    UploadLogoComponent
  ]
})
export class HomeModule { }
