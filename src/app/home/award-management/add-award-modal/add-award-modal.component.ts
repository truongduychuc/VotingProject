import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TeamService} from '../../../_services/team.service';
import {AwardService} from '../../../_services/award.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Team} from '../../../_models/team';
import {NotifierService} from 'angular-notifier';
import * as moment from 'moment';

@Component({
  selector: 'app-add-award',
  templateUrl: './add-award-modal.component.html',
  styleUrls: ['./add-award-modal.component.scss'],
})
export class AddAwardModalComponent implements OnInit {
  years: number[] = [];
  types: any[];
  nomineesList: any[];
  listTeams: Team[]; // for finding and patching team_name to nominee object
  addAward: FormGroup;
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;

  constructor(public activeModal: NgbActiveModal, private teamService: TeamService, private awardService: AwardService,
              private formBuilder: FormBuilder, private notifier: NotifierService) {
  }

  ngOnInit() {
    this.getListNominees();
    this.getAwardTypes();
    this.setYearsArray();
    this.generateForm();
  }

  generateForm() {
    this.setDateInitially();
    this.addAward = this.formBuilder.group({
      type: '',
      name: '',
      year: ['', Validators.required],
      id_nominee: [[], [Validators.required, Validators.minLength(4)]],
      id_role_voter: [null, Validators.required],
      // every award can only have date_start chosen from today
      date_start: [this.minStartDate.toISOString().substring(0, 16), [Validators.required]],
      date_end: [null, Validators.required],
      // prize contain only numbers
      prize: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      item: '',
      description: ''
    }, {
      validators: [
        this.dateValidation('date_start', 'date_end')
      ]
    });
  }

  setYearsArray() {
    const currentYear = new Date().getFullYear();
    this.years.push(currentYear);
    this.years.push(currentYear - 1);
    // console.log(this.years);
  }

  getListNominees() {
    this.teamService.getListForNominating().subscribe(successRes => {
      // console.log(this.nomineesList);
      this.teamService.getAllTeams().subscribe(teams => {
        this.nomineesList = successRes.data;
        this.listTeams = teams;
        if (!this.nomineesList) {
          console.log('Nominee list is undefined!');
        } else {
          this.nomineesList.forEach(value => {
            const team = this.listTeams.find(team => team.id === value.id_team);
            if (!team) {
              console.log('Error when finding equivalent team!');
            } else {
              value.team_name = team.name;
            }
          });
        }
      }, error1 => console.log(error1));
    }, error => {
      console.log(error);
    });
  }

  getAwardTypes() {
    this.awardService.getAwardTypes().subscribe((res) => {
      this.types = res.types;
    }, error => {
      console.log(error);
    });
  }

  // onSubmit
  createNewAward() {
    if (this.addAward.invalid) {
      // console.log('Invalid!');
      return;
    } else {
      this.awardService.createNewAward(this.addAward.value).subscribe(() => { // success
        this.activeModal.close('Award created successfully!');
      }, err => {
        // console.log(err);
        if (typeof err === 'string') {
          this.notifier.notify('error', err);
        }
      });
    }
  }

  setDateInitially() {
    const today = new Date();
    this.minStartDate = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes() + 1, 0));
    this.maxStartDate = new Date(Date.UTC(today.getFullYear() + 1, 11, 31, 23, 0, 0));
    this.minEndDate = this.minStartDate;
    this.maxEndDate = new Date(Date.UTC(this.minStartDate.getFullYear() + 1, this.minStartDate.getMonth(), this.minStartDate.getDate()));
  }

  dateValidation(startDateName: string, endDateName: string) {
    return (formGroup: FormGroup) => {
      const startDate = formGroup.controls[startDateName];
      const endDate = formGroup.controls[endDateName];
      const startDateValue = new Date(startDate.value);
      const endDateValue = new Date(endDate.value);
      const today = new Date();
      if (startDate.errors && !startDate.errors.dateError) {
        return;
      } else {
        if (startDateValue.getDate() === today.getDate() &&
          startDateValue.getMonth() === today.getMonth() &&
          startDateValue.getFullYear() === today.getFullYear()
        ) {
          if (!moment().isBefore(startDateValue)) {
            startDate.setErrors({dateError: true, message: 'Start time can not be smaller than current time'});
          }
        } else {
          if (!moment().isBefore(startDateValue)) {
            startDate.setErrors({dateError: true, message: 'Start date must be greater than today'});
          }
        }
        if (!moment(startDateValue).isBefore(this.maxStartDate)) {
          startDate.setErrors({
            dateError: true,
            message: `Start date can not be greater than ${this.maxStartDate.toISOString().substring(0, 10)}`
          });
        }
      }
      if (endDate.errors && !endDate.errors.dateError) {
        return;
      } else {
        if (!moment().isBefore(endDateValue)) {
          endDate.setErrors({dateError: true, message: 'End date must be greater than today'});
        }
        if (!moment(startDateValue).isBefore(endDateValue)) {
          endDate.setErrors({dateError: true, message: 'End date must be greater than start date'});
        }
        if (!moment(endDateValue).isBefore(this.maxEndDate)) {
          endDate.setErrors({
            dateError: true,
            message: `End date can not be greater than ${this.maxEndDate.toISOString().substring(0, 10)}`
          });
        }
      }
    };
  }

  changeDateLimit() {
    const startDateValue = new Date(this.formControl['date_start'].value);
    this.minEndDate = new Date(
      startDateValue.getFullYear(),
      startDateValue.getMonth(),
      startDateValue.getDate(),
      startDateValue.getHours(),
      startDateValue.getMinutes());
    this.maxEndDate = new Date(
      startDateValue.getFullYear() + 1,
      startDateValue.getMonth(),
      startDateValue.getDate(),
      startDateValue.getHours(),
      startDateValue.getMinutes());
  }

  get formControl() {
    return this.addAward.controls;
  }
}
