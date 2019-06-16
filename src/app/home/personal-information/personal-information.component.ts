import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AccountService} from '../../_services/account.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  personalUpdating: FormGroup;
  editable: boolean = false;
  currentUserProfile: User;
  directManager: any;
  message;
  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private notifier: NotifierService) { }

  ngOnInit() {
    this.getUserInfo();
  }
  generateForm(): void {
    this.personalUpdating = this.formBuilder.group({
      phone: this.currentUserProfile.phone,
      address: this.currentUserProfile.address,
      achievement: this.currentUserProfile.achievement
    });
  }
  get isDisabledButton() {
    if ('' == this.formControl.phone.value && '' == this.formControl.address.value && '' == this.formControl.achievement.value) {
      return true;
    } else {
      return false;
    }
  }
  updateInfo() {
    if ('' == this.formControl.phone.value && '' == this.formControl.address.value && '' == this.formControl.achievement.value) {
      return;
    }
    if (this.personalUpdating.invalid || !this.checkIfHasAnyChanges()) {
      return;
    }
      this.accountService.updatePersonalProfile(this.personalUpdating.value).subscribe(
        res => {
          // console.log(res);
          this.getUserInfo();
          this.notifier.notify('info', 'Updated information successfully!');
          this.editable = false;
        }, error1 => {
          console.log(error1);
        }
      );
  }
  get formControl() {
    return this.personalUpdating.controls;
  }
  changeEditable() {
    this.editable = !this.editable;
  }
  checkIfHasAnyChanges(): boolean {
    if (this.formControl['phone'].value !== this.currentUserProfile.phone
      || this.formControl['address'].value !== this.currentUserProfile.address
    || this.formControl['achievement'].value !== this.currentUserProfile.achievement) {
      return true;
    }
    return false;
  }
  listenForChanges() {
    this.personalUpdating.valueChanges.subscribe(changed => {
      this.checkIfHasAnyChanges();
    });
  }
  getUserInfo() {
    this.accountService.getPersonalProfile().subscribe((userProfileRes: any) => {
      this.currentUserProfile = userProfileRes.user;
      if (!userProfileRes.hasOwnProperty('directManager')) {
        this.message = userProfileRes.message;
      } else {
        this.directManager = userProfileRes.directManager;
      }
      this.generateForm();
      this.listenForChanges();
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }
}
