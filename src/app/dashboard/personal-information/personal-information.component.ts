import { Component, OnInit } from '@angular/core';
import {User} from "../../_models/user";
import {AuthenticationService} from "../../_services/authentication.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  editable: boolean;
  currentUserProfile: User;

  address: string;
  phone: string;
  other: string;
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.editable = false;
    this.getUserInfo();
  }
  changeEditable() {
    this.editable = !this.editable;
  }
  getUserInfo() {
    this.authService.getPersonalProfile().subscribe((userProfileRes:User) => {
      this.currentUserProfile = userProfileRes;
    }, (err: HttpErrorResponse) => {
      console.log(err + ' status: ' +err.status);
    })
  }
}
