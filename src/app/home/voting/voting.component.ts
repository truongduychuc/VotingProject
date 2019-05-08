import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AwardService} from '../../_services/award.service';
import {AccountService} from '../../_services/account.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  voting: FormGroup;
  listAwards: any[];
  listNominees: any[];
  constructor(private formBuilder: FormBuilder, private awardService: AwardService, private userService: AccountService) { }

  ngOnInit() {
    this.generateForm();
    this.getListAwardForVoting();
  }
  generateForm() {
    this.voting = this.formBuilder.group({
      id: [null, Validators.required],
      first_vote: [null, Validators.required],
      second_vote: [null, Validators.required],
      third_vote: [null, Validators.required]
    });
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
    this.resetAllSelections();
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
    this.awardService.vote(this.voting.value).subscribe( data => {
      console.log(data);
    }, err => {
      console.log(err);
    });
  }
  resetAllSelections() {
    this.voting.controls['first_vote'].setValue(null);
    this.voting.controls['second_vote'].setValue(null);
    this.voting.controls['third_vote'].setValue(null);
  }
}
