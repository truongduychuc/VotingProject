import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import {ChangePasswordFormComponent} from "./change-password-form/change-password-form.component";
import {CreateUserFormComponent} from "./employee-list/create-user-form/create-user-form.component";
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
import { AddAwardComponent } from './award-list/add-award/add-award.component';
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [
    ChangePasswordFormComponent,
    CreateUserFormComponent,
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
    AddAwardComponent
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
    CreateUserFormComponent,
    AddAwardComponent,
    ChangePasswordFormComponent
  ]
})
export class HomeModule { }
