import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FooterComponent} from './footer/footer.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CreateUserFormComponent} from './create-user-form/create-user-form.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginFormComponent} from './login-form/login-form.component';
import {AuthInterceptor} from "./_interceptors/auth.interceptor";
import {ErrorInterceptor} from "./_interceptors/error.interceptor";
import {EmployeeListComponent} from './employee-list/employee-list.component';
import {InputsModule, TableModule, IconsModule} from "angular-bootstrap-md";
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    CreateUserFormComponent,
    LoginFormComponent,
    EmployeeListComponent,
    ChangePasswordFormComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    IconsModule,
    InputsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
