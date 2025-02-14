import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication.service';
import {Router} from '@angular/router';
import {AccountService} from '../../_services/account.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  loginForm: FormGroup;
  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder,
  private authService: AuthenticationService, private router: Router, private notifier: NotifierService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.activeModal.close('Login successfully');
    } else {
      this.generateForm();
    }
  }
  // create form by using form builder
  private generateForm(): void {
   this.loginForm = this.formBuilder.group({
     username: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ. ]+$')]],
     password: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ. ]+$')]]
   });
  }

  loginWithUserAndPass() {
    // console.log(this.loginForm.controls);
    if (this.loginForm.invalid) {
      return;
    }
    const username = this.getControl.username.value;
    const password = this.getControl.password.value;
    this.authService.login(username, password).subscribe(res => {
      // get current user after set token
      this.activeModal.close('Login successfully!');
    }, errorLogin => {
      this.notifier.notify('error', errorLogin);
    } );
  }

  // get all controls of loginForm, can use this function with command like getControl.controlName;
  get getControl() {
    return this.loginForm.controls;
  }


}
