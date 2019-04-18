import {Component, OnInit} from '@angular/core';
import {User} from "../../_models/user";
import {HttpErrorResponse} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../_services/account.service";
import {map, tap} from "rxjs/operators";
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
  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.generateForm();
    this.getUserInfo();
  }
  generateForm(): void {
    this.personalUpdating = this.formBuilder.group({
      phone: this.currentUserProfile.phone,
      address: this.currentUserProfile.address,
      other: this.currentUserProfile.other
    })
  }
  updateInfo() {
    if('' == this.formControl.phone.value &&'' == this.formControl.address.value &&'' == this.formControl.other.value) {
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
      )
    }
  }
  get formControl() {
    return this.personalUpdating.controls;
  }
  changeEditable() {
    this.editable = !this.editable;
  }
  getUserInfo() {
    this.accountService.getPersonalProfile().subscribe((userProfileRes:User) => {
      this.currentUserProfile = userProfileRes;
      console.log(this.currentUserProfile);
    }, (err: HttpErrorResponse) => {
      console.log(err + ' status: ' +err.status);
    })
  }
}
