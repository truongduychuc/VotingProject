import {NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import {ChangePasswordFormComponent} from "./change-password-form/change-password-form.component";
import {CreateUserFormComponent} from "./create-user-form/create-user-form.component";
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {FooterComponent} from "./footer/footer.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {IconsModule, InputsModule, TableModule} from "angular-bootstrap-md";
import {DataTrackingComponent } from './data-tracking/data-tracking.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    ChangePasswordFormComponent,
    CreateUserFormComponent,
    EmployeeListComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DataTrackingComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    DashboardRoutingModule,
    TableModule,
    IconsModule,
    InputsModule,
    NgbModule
  ]
})
export class DashboardModule { }
