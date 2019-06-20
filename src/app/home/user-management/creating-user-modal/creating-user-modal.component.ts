import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../../_services/account.service';
import {Router} from '@angular/router';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TeamService} from '../../../_services/team.service';
import {Team} from '../../../_models/team';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './creating-user-modal.component.html',
  styleUrls: ['./creating-user-modal.component.scss']
})
export class CreatingUserModalComponent implements OnInit {
  createUser: FormGroup;
  listTeams: Team[];
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private router: Router,
              public activeModal: NgbActiveModal, private teamService: TeamService, private notifier: NotifierService) {
  }
  ngOnInit() {
    this.getAllTeams();
    // generate form by using FormBuilder
    this.generateForm();
  }

  generateForm() {
    this.createUser = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ. ]+$')]],
      password: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ. ]+$')]],
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
  // using service send post method, and retrieve message and error
    this.accountService.registerNewUser(this.createUser.value).subscribe(data => {
      this.activeModal.close('User created successfully!');

    }, error1 => {
      if (typeof error1 === 'string') {
        this.notifier.notify('error', error1);
      }
    });
  }
}
