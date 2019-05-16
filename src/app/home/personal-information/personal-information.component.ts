import {Component, OnInit} from '@angular/core';
import {User} from "../../_models/user";
import {HttpErrorResponse} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountService} from "../../_services/account.service";
import {Router} from "@angular/router";

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
  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.getUserInfo();
    this.generateForm();
  }
  generateForm(): void {
    this.personalUpdating = this.formBuilder.group({
      phone: '',
      address: '',
      other: ''
    });
  }
  get isDisabledButton() {
    if ('' == this.formControl.phone.value && '' == this.formControl.address.value && '' == this.formControl.other.value) {
      return true;
    } else {
      return false;
    }
  }
  updateInfo() {
    if('' == this.formControl.phone.value && '' == this.formControl.address.value && '' == this.formControl.other.value) {
      console.log(this.personalUpdating.value);
      return;
    } else {
      this.accountService.updatePersonalProfile(this.personalUpdating.value).subscribe(
        res => {
          console.log(res);
          this.getUserInfo();
        }, error1 => {
          console.log(error1);
        }
      );
    }
  }
  get formControl() {
    return this.personalUpdating.controls;
  }
  changeEditable() {
    this.editable = !this.editable;
  }
  getUserInfo() {
    this.accountService.getPersonalProfile().subscribe((userProfileRes:any) => {
      this.currentUserProfile = userProfileRes.user;
      if(!userProfileRes.hasOwnProperty('directManager')) {
        this.message = userProfileRes.message;
        console.log(userProfileRes.message);
      }
      else {
        console.log('Has direct manager!');
        this.directManager = userProfileRes.directManager;
        console.log(this.currentUserProfile);
      }
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })
  }
}
