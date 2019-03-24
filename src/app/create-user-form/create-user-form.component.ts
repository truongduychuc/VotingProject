import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss']
})
export class CreateUserFormComponent implements OnInit {
  createUser:FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
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
      other: ['']
    }, {
      //password match
        validator:this.MustMatch('password','passwordConfirmationInput')
    });
  }
  onSubmit () {
      console.log(this.createUser);
  }
  MustMatch(controlName: string, matchingControlName: string) {
      return (formGroup: FormGroup) => {
        //get main control and the control which you want to compare to
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if(matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
        }
        //set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({mustMatch: true});
        }
        else {
          matchingControl.setErrors(null);
        };
      }
  }

}
