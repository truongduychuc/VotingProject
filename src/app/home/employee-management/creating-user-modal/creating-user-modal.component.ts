import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../../_services/account.service';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TeamService} from '../../../_services/team.service';
import {Team} from '../../../_models/team';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './creating-user-modal.component.html',
  styleUrls: ['./creating-user-modal.component.scss']
})
export class CreatingUserModalComponent implements OnInit {
  createUser: FormGroup;
  listTeams: Team[];
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router,
              public activeModal: NgbActiveModal, private teamService: TeamService) {
  }
  ngOnInit() {
    this.getAllTeams();
    // generate form by using FormBuilder
    this.generateForm();
  }

  generateForm() {
    this.createUser = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      english_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      id_role: ['', [Validators.required]],
      id_team: ['']
    });
  }
  getAllTeams() {
    this.teamService.getAllTeams().subscribe( teams => {
      this.listTeams = teams;
    }, err => {
      console.log(err);
    });
  }
  onSubmit() {
    if (this.createUser.invalid) {
      return;
    }
    if (this.createUser.value === undefined) {
      console.log('Undefined form value!');
      return;
    }
    // if position field was not chosen, it would be assigned 99 automatically
    if (this.createUser.controls['id_role'].value === undefined || this.createUser.controls['id_role'].value === null) {
      this.createUser.controls['id_role'].setValue('');
    }
    console.log(this.createUser.value);
  // using service send post method, and retrieve message and error
    this.accountService.registerNewUser(this.createUser.value).subscribe(data => {
      alert(data.message);
      this.activeModal.close('User created successfully!');

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
