import {Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AwardService} from '../../_services/award.service';
import {AccountService} from '../../_services/account.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  serverURL = 'http://localhost:4000/';
  voting: FormGroup;
  listAwards: any[];
  listNominees: any[];
  constructor(private formBuilder: FormBuilder, private awardService: AwardService, private userService: AccountService) { }

  ngOnInit() {
    this.getListAwardForVoting();
    this.getListAwardForVoting();
    this.generateForm();
  }
  generateForm() {
    this.voting = this.formBuilder.group({
      id: [null, Validators.required],
      first_vote: [null, Validators.required],
      second_vote: [null, Validators.required],
      third_vote: [null, Validators.required]
    }, {
      validators: [
        this.duplicatedSelect('first_vote', 'second_vote'),
        this.duplicatedSelect('first_vote', 'third_vote'),
        this.duplicatedSelect('second_vote', 'third_vote'),
      ]
    });
  }
  get formControls() {
    return this.voting.controls;
  }
  // get list of award is going on
  getListAwardForVoting() {
    this.awardService.getAwardComingAbout().subscribe( (success: any) => {
      console.log(success);
      if (!success.hasOwnProperty('data')) {
        console.log('The response has no property named \'data!\'');
      } else {
        this.listAwards = success.data;
      }
    }, err => {
      console.log(err);
    });
  }
  // load list of nominees for award has id === id
  loadNomineesCorresponding(id: number) {
    this.resetNomineeSelections();
    this.userService.getListNomineesForVoting(id).subscribe( (success: any) => {
      console.log(success);
      if (!success.hasOwnProperty('data')) {  // check response if it get back the true data
        console.log('The response has no property named \'data!\'');
      } else {
        this.listNominees = success.data;
        console.log(this.listNominees);
      }
    } , err => {
      console.log(err);
    });
  }
  // onSubmit
  // send the result after finishing up choosing nominee for all places
  sendVotingElection() {
    console.log(this.voting.value);
    if (this.voting.invalid) {
      return;
    }
    this.awardService.vote(this.voting.value).subscribe( successMes => {
      alert(successMes);
    }, err => {
      console.log(err);
    });
  }
  duplicatedSelect(firstControl: string, secondControl: string) {
    return (formGroup: FormGroup) => {
      const first = formGroup.controls[firstControl];
      const second = formGroup.controls[secondControl];
      if (first.errors && !first.errors.duplicated) {
        return;
      }
      if (second.errors && !second.errors.duplicated) {
        return;
      }
      if (first.value !== second.value) {
       first.setErrors(null);
       second.setErrors(null);
      } else {
        first.setErrors({duplicated: true, message: 'Duplicated selection!'});
        second.setErrors({duplicated: true, message: 'Duplicated selection!'});
      }
    };
  }
  // get avatar url
  getNomineeAvaUrl(id: number): string {
    const selectedNominee = this.listNominees.find( nominee => nominee.id_nominee === id);
    if (!selectedNominee) {
      console.log('Error when finding avatar!');
      return null;
    } else {
      if (!selectedNominee.hasOwnProperty('nominee_name_1')) {
        console.log('Error with nominee_name');
        return null;
      }
      return selectedNominee.nominee_name_1.ava_url;
    }
  }
  resetAllSelections() {
    // reset all
    this.voting.controls['id'].setValue(null);
    // refresh list of awards
    this.getListAwardForVoting();
    this.voting.controls['first_vote'].setValue(null);
    this.voting.controls['second_vote'].setValue(null);
    this.voting.controls['third_vote'].setValue(null);
  }
  resetNomineeSelections() {
    // refresh selections without refreshing awards
    this.voting.controls['first_vote'].setValue(null);
    this.voting.controls['second_vote'].setValue(null);
    this.voting.controls['third_vote'].setValue(null);
  }
}
