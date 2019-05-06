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
import {LoginModalComponent} from "./default/login-modal/login-modal.component";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    LoginModalComponent,
    PageNotFoundComponent
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
    LoginModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
