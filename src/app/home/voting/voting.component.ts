import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AwardService} from '../../_services/award.service';
import {AccountService} from '../../_services/account.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../../notification-dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  voting: FormGroup;
  listAwards: any[];
  listNominees: any[];
  constructor(private formBuilder: FormBuilder, private awardService: AwardService,
              private userService: AccountService, private modalService: NgbModal) { }

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
        this.duplicatedOption('first_vote', 'second_vote'),
        this.duplicatedOption('first_vote', 'third_vote'),
        this.duplicatedOption('second_vote', 'third_vote'),
      ]
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
    const modalRef = this.modalService.open(ConfirmDialogComponent, {size: 'sm'});
    modalRef.componentInstance.dialogContent = 'Are you sure?';
    modalRef.result.then( () => {
      this.awardService.vote(this.voting.value).subscribe( successMes => {
        alert(successMes);
      }, err => {
        console.log(err);
      });
    }, () => {
      return;
    });
  }
  // make the command of getting form control faster
  get formControls() {
    return this.voting.controls;
  }
  resetNomineeSelections() {
    console.log(this.voting);
    this.voting.controls['first_vote'].setValue(null);
    this.voting.controls['second_vote'].setValue(null);
    this.voting.controls['third_vote'].setValue(null);
  }
  resetWholeSelections() {
    this.voting.controls['id'].setValue(null);
    this.voting.controls['first_vote'].setValue(null);
    this.voting.controls['second_vote'].setValue(null);
    this.voting.controls['third_vote'].setValue(null);
  }
  // validation for preventing from selecting the same nominee for different places
  duplicatedOption(firstControl: string, secondControl: string) {
    return (formGroup: FormGroup) => {
      const message1_3 = 'Duplicate between 1st place and 3rd place';
      const message2_3 = 'Duplicate between 2nd place and 3rd place';
      const message1_2 = 'Duplicate between 1st place and 2nd place';
      const first = formGroup.controls[firstControl];
      const second = formGroup.controls[secondControl];
      if ((first.errors && !first.errors.duplicatedOption)) {
        return;
      }
      if ((second.errors && !second.errors.duplicatedOption)) {
        return;
      }
      if (first.value === second.value) {
        if (firstControl === 'first_vote' && secondControl === 'second_vote') {
          first.setErrors({duplicatedOption: true, message: message1_2});
          second.setErrors({duplicatedOption: true, message: message1_2});
        }
        if (firstControl === 'second_vote' && secondControl === 'third_vote') {
          first.setErrors({duplicatedOption: true, message: message2_3});
          second.setErrors({duplicatedOption: true, message: message2_3});
        }
        if (firstControl === 'first_vote' && secondControl === 'third_vote') {
          first.setErrors({duplicatedOption: true, message: message1_3});
          second.setErrors({duplicatedOption: true, message: message1_3});
        }
      } else {
        first.setErrors(null);
        second.setErrors(null);
      }
    };
  }
}
