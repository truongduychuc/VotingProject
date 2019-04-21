import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import {ChangePasswordFormComponent} from "./change-password-form/change-password-form.component";
import {CreateUserFormComponent} from "./create-user-form/create-user-form.component";
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
    EditingModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    HomeRoutingModule,
    NgbModule
  ],
  providers: [
    NgbActiveModal
  ],
  entryComponents: [
    EditingModalComponent
  ]
})
export class HomeModule { }
