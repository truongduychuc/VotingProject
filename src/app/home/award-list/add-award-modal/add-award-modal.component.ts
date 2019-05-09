import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDateNativeAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {TeamService} from '../../../_services/team.service';
import {AwardService} from '../../../_services/award.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Team} from '../../../_models/team';

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
              private formBuilder: FormBuilder, private calendar: NgbCalendar, private dateNative: NgbDateNativeAdapter) { }

  ngOnInit() {
    this.getListNominees();
    this.getAwardTypes();
    this.setDateInitially();
    this.getListTeams();
    this.setYearsArray();
    this.generateForm();
  }
  generateForm() {
    this.addAward = this.formBuilder.group({
      type: '',
      name: '',
      year: ['', Validators.required],
      id_nominee: ['', Validators.required],
      id_role_voter: ['Who?', Validators.required],
      date_start: [this.dateStartMin, Validators.required], // every award can only have date_start chosen from today
      date_end: ['', Validators.required],
      prize: ['', Validators.required],
      item: '',
      description: ''
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
    this.resetDateEnd();
    const currentDateStart = this.addAward.controls['date_start'].value;
    console.log(new Date());
    console.log(currentDateStart);
    this.dateEndMin = currentDateStart;
    this.dateEndMax = <NgbDateStruct>{
      year: currentDateStart.year + 1,
      month: currentDateStart.month,
      day: currentDateStart.day
    };
  }
  // it is going to be involved if the date end < date start after selecting new date_start from date picker
  resetDateEnd() {
    console.log(this.dateNative.toModel(this.formControl['date_start'].value));
    const date_start = this.dateNative.toModel(this.formControl['date_start'].value);
    const date_end = this.dateNative.toModel(this.formControl['date_end'].value);
    if (date_start > date_end) {
      // console.log('OK!');
      this.formControl['date_end'].setValue(null);
    }
  }
  setYearsArray() {
    const currentYear = new Date().getFullYear();
    this.years.push(currentYear);
    this.years.push(currentYear - 1);
    // console.log(this.years);
  }
  getListNominees() {
    this.teamService.getListForNominating().subscribe( successRes => {
      this.nomineesList = successRes.data;
      // console.log(this.nomineesList);
    }, error => {
      console.log(error);
    });
  }
  getListTeams() {
    this.teamService.getAllTeams().subscribe( teams => {
      this.listTeams = teams;
      console.log(this.nomineesList);
      if (!this.nomineesList) {
        console.log('Nominee list is undefined!');
      } else {
        this.nomineesList.forEach(value => {
          let team = this.listTeams.find(team => team.id === value.id_team);
          if (!team) {
            console.log('Error when finding equivalent team!');
          } else {
            value.team_name = team.name;
          }
        });
        console.log(this.nomineesList);
      }
    }, error1 => console.log(error1));
  }
  getAwardTypes() {
    this.awardService.getAwardTypes().subscribe( successRes => {
      if (!successRes.hasOwnProperty('types')) {
        console.log('The response didn\'t include \'type\' property!');
      } else {
        this.types = successRes.types;
        console.log(this.types);
      }
    }, error => {
      console.log(error);
    });
  }
  // onSubmit
  createNewAward() {
    if (this.addAward.invalid) {
      console.log('Invalid!');
      return;
    } else {
      this.formControl['date_start'].setValue(this.dateNative.toModel(this.formControl['date_start'].value));
      this.formControl['date_end'].setValue(this.dateNative.toModel(this.formControl['date_end'].value));
      console.log(this.addAward.value);
      this.awardService.createNewAward(this.addAward.value).subscribe( success => {
        this.activeModal.close('Success!');
      }, err => {
        console.log(err);
      });
    }
  }
  get formControl() {
    return this.addAward.controls;
  }
  // onAwardNameSelectChanged() {
  //   const nameSelected = (<HTMLSelectElement>document.getElementById('awardName')).value;
  //   // console.log(nameSelected);
  //   if (nameSelected !== 'other') {
  //     this.showOtherNameInput = false;
  //   } else {
  //     this.showOtherNameInput = true;
  //   }
  // }
}
