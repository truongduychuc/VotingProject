import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDate, NgbDateNativeAdapter, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {TeamService} from '../../../_services/team.service';
import {AwardService} from '../../../_services/award.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Team} from '../../../_models/team';
import {NgbTime} from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-add-award',
  templateUrl: './add-award-modal.component.html',
  styleUrls: ['./add-award-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAwardModalComponent implements OnInit {
  years: number[] = [];
  types: any[];
  nomineesList: any[];
  listTeams: Team[]; // for finding and patching team_name to nominee object
  addAward: FormGroup;
  dateStartMin: NgbDateStruct;
  dateStartMax: NgbDateStruct;
  dateEndMin: NgbDateStruct;
  dateEndMax: NgbDateStruct;
  constructor(public activeModal: NgbActiveModal, private teamService: TeamService, private awardService: AwardService,
              private formBuilder: FormBuilder, private calendar: NgbCalendar, private dateNative: NgbDateNativeAdapter,
              private notifier: NotifierService) { }

  ngOnInit() {
    this.getListNominees();
    this.getAwardTypes();
    this.setDateInitially();
    // this.getListTeams();
    this.setYearsArray();
    this.generateForm();
  }
  generateForm() {
    const defaultTime: NgbTimeStruct = {
      hour: 12,
      minute: 0,
      second: 0
    };
    this.addAward = this.formBuilder.group({
      type: '',
      name: '',
      year: ['', Validators.required],
      id_nominee: [[], [Validators.required, Validators.minLength(4)]],
      id_role_voter: [null, Validators.required],
      date_start: [this.dateStartMin, Validators.required], // every award can only have date_start chosen from today
      date_end: [null, Validators.required],
      prize: ['', Validators.required],
      item: '',
      description: '',
      start_time: [defaultTime, Validators.required],
      end_time: [defaultTime, Validators.required],
    });
  }
  setDateInitially() {
    this.dateStartMin = this.calendar.getToday();
    this.dateStartMax = <NgbDateStruct> {
      year: this.dateStartMin.year,
      month: 12,
      day: 31
    };
    this.dateEndMin = this.dateStartMin;
    this.dateEndMax = <NgbDateStruct>{
      year: this.dateStartMin.year + 1,
      month: this.dateStartMin.month,
      day: this.dateStartMin.day
    };
  }
  changeDateEndLimit() {
    const currentDateStart = this.addAward.controls['date_start'].value;
    // console.log(this.dateNative.toModel(this.formControl['date_start'].value));
    this.dateEndMin = currentDateStart;
    this.dateEndMax = <NgbDateStruct>{
      year: currentDateStart.year + 1,
      month: currentDateStart.month,
      day: currentDateStart.day
    };
  }
  setYearsArray() {
    const currentYear = new Date().getFullYear();
    this.years.push(currentYear);
    this.years.push(currentYear - 1);
    // console.log(this.years);
  }
  getListNominees() {
    this.teamService.getListForNominating().subscribe( successRes => {
      // console.log(this.nomineesList);
      this.teamService.getAllTeams().subscribe( teams => {
        this.nomineesList = successRes.data;
        this.listTeams = teams
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
    this.awardService.getAwardTypes().subscribe( successRes => {
      if (!successRes.hasOwnProperty('types')) {
        console.log('The response didn\'t include \'type\' property!');
      } else {
        this.types = successRes.types;
        // console.log(this.types);
      }
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
      const startTime: NgbTime = this.formControl['start_time'].value;
      const endTime: NgbTime = this.formControl['end_time'].value;
      const startDate: NgbDate = this.formControl['date_start'].value;
      const endDate: NgbDate = this.formControl['date_end'].value;
      // concat date and time taken from datepicker and timepicker
      const startDateTime = new Date(startDate.year, startDate.month - 1, startDate.day, startTime.hour,  startTime.minute, startTime.second);
      const endDateTime = new Date(endDate.year, endDate.month - 1, endDate.day, endTime.hour,  endTime.minute, endTime.second);
      // console.log(startDateTime);
      this.formControl['date_start'].setValue(startDateTime);
      this.formControl['date_end'].setValue(endDateTime);
      this.formControl['start_time'].setValue(null);
      this.formControl['end_time'].setValue(null);
      // console.log(this.addAward.value);
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
  get formControl() {
    return this.addAward.controls;
  }
}
