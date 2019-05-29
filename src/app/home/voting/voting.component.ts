import {Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AwardService} from '../../_services/award.service';
import {AccountService} from '../../_services/account.service';
import {Award} from '../../_models/award';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../../modals/confirm-modal/confirm-modal.component';
import {NotifierService} from 'angular-notifier';

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
  errorMessage: string;
  constructor(private formBuilder: FormBuilder, private awardService: AwardService,
              private userService: AccountService, private modalService: NgbModal, private notifier: NotifierService) { }

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
        this.duplicatedSelect('first_vote', 'second_vote', 'third_vote')
      ]
    });
  }
  get formControls() {
    return this.voting.controls;
  }
  // get list of award is going on
  getListAwardForVoting() {
    this.awardService.getAwardComingAbout().subscribe( (success: any) => {
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
    if (this.voting.invalid) {
      return;
    }
    const modalRef = this.modalService.open(ConfirmModalComponent, {size: 'sm'});
    modalRef.componentInstance.title = 'Confirmation';
    modalRef.componentInstance.content = 'Are you sure with your voting selections?'
    modalRef.componentInstance.type = 'primary';
    modalRef.result.then( accept => {
      this.awardService.vote(this.voting.value).subscribe( (successMes: string) => {
        this.notifier.notify('info', 'Voted successfully!');
      }, err => {
        // display error message to alert, the message is returned from error interceptor
        if (typeof err !== 'string') {
          console.log('Error was not handled properly by interceptor: ' + err);
          return;
        }
        this.errorMessage = err;
      });
    }, cancel => {
      return;
    });
  }
  // validation for duplicated selection
  duplicatedSelect(firstControl: string, secondControl: string, third_control: string) {
    return (formGroup: FormGroup) => {
      const first = formGroup.controls[firstControl];
      const second = formGroup.controls[secondControl];
      const third = formGroup.controls[third_control];
      if (first.errors && !first.errors.duplicated) {
        return;
      } else {
        if (first.value === second.value && first.value !== third.value) {
          first.setErrors({duplicated: true, message: 'Duplicated selection!'});
          second.setErrors({duplicated: true, message: 'Duplicated selection!'});
          third.setErrors(null);
        }
        if (first.value === third.value && first.value !== second.value) {
          first.setErrors({duplicated: true, message: 'Duplicated selection!'});
          second.setErrors(null);
          third.setErrors({duplicated: true, message: 'Duplicated selection!'});
        }
        if (first.value === third.value && first.value === second.value && second.value === third.value) {
          first.setErrors({duplicated: true, message: 'Duplicated selection!'});
          second.setErrors({duplicated: true, message: 'Duplicated selection!'});
          third.setErrors({duplicated: true, message: 'Duplicated selection!'});
        }
      }
      if (second.errors && !second.errors.duplicated) {
        return;
      } else {
        if (second.value === third.value && second.value !== first.value) {
          first.setErrors(null);
          second.setErrors({duplicated: true, message: 'Duplicated selection!'});
          third.setErrors({duplicated: true, message: 'Duplicated selection!'});
        }
        if (first.value === second.value && second.value !== third.value) {
          first.setErrors({duplicated: true, message: 'Duplicated selection!'});
          second.setErrors({duplicated: true, message: 'Duplicated selection!'});
          third.setErrors(null);
        }
        if (first.value === third.value && first.value === second.value && second.value === third.value) {
          first.setErrors({duplicated: true, message: 'Duplicated selection!'});
          second.setErrors({duplicated: true, message: 'Duplicated selection!'});
          third.setErrors({duplicated: true, message: 'Duplicated selection!'});
        }
      }
      if (third.errors && !third.errors.duplicated) {
        return;
      } else {
        if (second.value === third.value && third.value !== first.value) {
          first.setErrors(null);
          second.setErrors({duplicated: true, message: 'Duplicated selection!'});
          third.setErrors({duplicated: true, message: 'Duplicated selection!'});
        }
        if (first.value === third.value && third.value !== second.value) {
          first.setErrors({duplicated: true, message: 'Duplicated selection!'});
          second.setErrors(null);
          third.setErrors({duplicated: true, message: 'Duplicated selection!'});
        }
        if (first.value === third.value && first.value === second.value && second.value === third.value) {
          first.setErrors({duplicated: true, message: 'Duplicated selection!'});
          second.setErrors({duplicated: true, message: 'Duplicated selection!'});
          third.setErrors({duplicated: true, message: 'Duplicated selection!'});
        }
      }
      if (first.value !== second.value && second.value !== third.value && first.value !== third.value) {
        first.setErrors(null);
        second.setErrors(null);
        third.setErrors(null);
      }
    };
  }
  getAward(id: number): Award {
    const selectedAward = this.listAwards.find(award => award.id === id);
    if (!selectedAward) {
      console.log('Error when finding award!');
      return null;
    }
    return selectedAward;
  }
  // get avatar url
  getNomineeAvaUrl(id: number): string {
    const selectedNominee = this.listNominees.find( nominee => nominee.id_nominee === id);
    if (!selectedNominee) {
      console.log('Error when finding nominee!');
      return null;
    } else {
      if (!selectedNominee.hasOwnProperty('nominee_name_1')) {
        console.log('Error with nominee_name');
        return null;
      }
      return selectedNominee.nominee_name_1.ava_url;
    }
  }
  getNomineeFullName(id: number): string {
    const selectedNominee = this.listNominees.find( nominee => nominee.id_nominee === id);
    if (!selectedNominee) {
      console.log('Error when finding nominee!');
      return null;
    } else {
      if (!selectedNominee.hasOwnProperty('nominee_name_1')) {
        console.log('Error with nominee_name');
        return null;
      }
      return selectedNominee.nominee_name_1.first_name
        + ' (' + selectedNominee.nominee_name_1.english_name +
        ') '
        + selectedNominee.nominee_name_1.last_name;
    }
  }
  resetAllSelections() {
    // reset all
    this.voting.controls['id'].setValue(null);
    // refresh list of awards
    this.getListAwardForVoting();
    this.resetNomineeSelections();
  }
  resetNomineeSelections() {
    // refresh selections without refreshing awards
    this.errorMessage = null;
    this.voting.controls['first_vote'].setValue(null);
    this.voting.controls['second_vote'].setValue(null);
    this.voting.controls['third_vote'].setValue(null);
  }
  // test() {
  //   console.log(this.voting.controls);
  // }
}
