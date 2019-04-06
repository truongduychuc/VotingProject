import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from "../services/authentication.service";
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService) { }

  ngOnInit() {
    this.generateForm();
    this.authService.logout();
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
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;
    this.authService.login(username, password).subscribe(res => {
    console.log(res);
    this.authService.setSession(res);
    console.log(this.authService.getExpiration());
    console.log(this.authService.isLoggedIn());

    }, error1 => console.log(error1));
  }

  // get all controls of loginForm, can use this function with command like getControl.controlName;
  get getControl() {
    return this.loginForm.controls;
  }


}
