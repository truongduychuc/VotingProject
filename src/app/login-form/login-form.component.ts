import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService} from "../services/authentication.service";
import { first } from 'rxjs/operators';
import { Router } from "@angular/router";
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router :Router) { }

  ngOnInit() {
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
    this.authService.login(username, password).pipe(first()).subscribe(res => {
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
