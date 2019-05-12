import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../_services/account.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {
  changingPasswordForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.generateForm();
  }
  generateForm() {
    this.changingPasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', [Validators.required]]
    }, {
      validator: this.MustMatch('newPassword', 'confirmNewPassword')
    });
  }
  onSubmit() {
    if(this.changingPasswordForm.invalid) {
      return;
    }
    let old_password = this.changingPasswordForm.controls['currentPassword'].value;
    let new_password = this.changingPasswordForm.controls['newPassword'].value;
    console.log(old_password + ' ' +new_password);
    this.accountService.changePassword(old_password, new_password).subscribe(
      successMessageObj => {
        console.log(successMessageObj);
      }, error1 => {
        console.log(JSON.stringify(error1));
      }
    );
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      // get main control and the control which you want to compare to
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

}
