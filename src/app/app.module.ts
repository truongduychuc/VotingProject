import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./_interceptors/auth.interceptor";
import {ErrorInterceptor} from "./_interceptors/error.interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DefaultComponent} from "./default/default.component";
import {LoginFormComponent} from "./default/login-form/login-form.component";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { GroupByPipe } from './_pipes/group-by.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    LoginFormComponent,
    PageNotFoundComponent,
    GroupByPipe
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  entryComponents: [
    LoginFormComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
