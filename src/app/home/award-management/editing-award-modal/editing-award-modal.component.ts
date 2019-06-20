import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AwardService} from '../../../_services/award.service';
import {NotifierService} from 'angular-notifier';
import {Award} from '../../../_models/award';
@Component({
  selector: 'app-editing-award-modal',
  templateUrl: './editing-award-modal.component.html',
  styleUrls: ['./editing-award-modal.component.scss']
})
export class EditingAwardModalComponent implements OnInit {
  @Input()
  awardDetail: Award;
  awardId: number;
  currentPrize;
  currentItem;
  editAward: FormGroup;
  constructor(public activeModal: NgbActiveModal, private awardService: AwardService,
              private formBuilder: FormBuilder, private notifier: NotifierService) { }

  ngOnInit() {
    this.getAwardDetail();
  }
  // get award info to fill out input
  getAwardDetail() {
    this.awardService.getAwardDetail(this.awardId).subscribe(awardInfo => {
      this.awardDetail = awardInfo;
      this.generateForm();
      this.listenForChanges();
    }, error =>  {
    });
  }
  generateForm() {
    this.editAward = this.formBuilder.group({
      prize: [this.awardDetail.prize, Validators.required],
      item: [this.awardDetail.item],
    });
  }
  get formControl() {
    return this.editAward.controls;
  }
  checkChanges(): boolean {
    if (this.formControl['prize'].value !== this.awardDetail.prize || this.formControl['item'].value !== this.awardDetail.item) {
      return true;
    }
    return false;
  }
  listenForChanges() {
    this.editAward.valueChanges.subscribe(changed => {
      this.checkChanges();
    });
  }
  // send information changed
  updateAward() {
    if (this.editAward.invalid || !this.checkChanges()) {
      return;
    }
    this.awardService.updateAward(this.awardId, this.editAward.value).subscribe( () => {
      this.activeModal.close('Updated award successfully!');
    }, err => {
      console.log(err);
    });
  }
}
