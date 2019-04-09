import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../_services/account.service';
import {User} from '../_models/user';
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss']
})
export class CreateUserFormComponent implements OnInit {
  createUser: FormGroup;
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router) {
  }
  ngOnInit() {
    // generate form by using FormBuilder
    this.generateForm();
  }

  generateForm() {
    this.createUser = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmationInput: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      englishName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', [Validators.required]]
    }, {
      // password matching checking
      validator: this.MustMatch('password', 'passwordConfirmationInput')
    });
  }

  onSubmit() {
    if (this.createUser.invalid) {
      return;
    }
    // get value from inputs and create a new User object
  let newAccount = <User> {
      username: this.createUser.controls['username'].value,
      password: this.createUser.controls['password'].value,
      first_name: this.createUser.controls['firstName'].value,
      last_name: this.createUser.controls['lastName'].value,
      english_name: this.createUser.controls['englishName'].value,
      email: this.createUser.controls['email'].value,
      id_role: parseInt(this.createUser.controls['position'].value)
    };
  // using service send post method, and retrieve message and error
    this.accountService.registerNewUser(newAccount).subscribe(data => {
      alert(data.message);
      this.router.navigate(['login']);

    }, error1 => console.log(error1));
  }

  // this function helps us to compare password
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
