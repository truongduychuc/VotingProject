import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService} from "../../_services/authentication.service";
import {first, tap} from 'rxjs/operators';
import { Router } from "@angular/router";
import {AccountService} from "../../_services/account.service";
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router :Router, private accountService: AccountService) { }

  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
    this.generateForm();
  }
  // create form by using form builder
  private generateForm(): void {
   this.loginForm = this.formBuilder.group({
     username: ['', Validators.required],
     password: ['', [Validators.required, Validators.minLength(8)]]
   });
  }

  loginWithUserAndPass() {
    if(this.loginForm.invalid) {
      return;
    }
    const username = this.getControl.username.value;
    const password = this.getControl.password.value;
    this.authService.login(username, password).subscribe(res => {
      // get current user after set token
        this.router.navigate(['dashboard']);
    }, errorLogin => {
      console.log('Login form' + JSON.stringify(errorLogin));
    } );
  }

  // get all controls of loginForm, can use this function with command like getControl.controlName;
  get getControl() {
    return this.loginForm.controls;
  }


}
