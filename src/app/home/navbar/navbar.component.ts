import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AccountService} from "../../_services/account.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {User} from "../../_models/user";
import {ChangePasswordFormComponent} from "../change-password-form/change-password-form.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  currentUserProfile: User;
  public sidebarOpened = false;
  constructor(private authService: AuthenticationService, private accountService: AccountService, private router: Router, config: NgbDropdownConfig, private modalService: NgbModal) {
    config.placement = 'bottom';
  }
  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    }
    else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }
  ngOnInit() {
    this.getCurrentUserProfile();
  }
  getCurrentUserProfile() {
    this.accountService.getPersonalProfile().subscribe(
      res => {
        this.currentUserProfile = res.user;
        console.log(res.user);
      }, error1 => {
        console.log(error1);
      }
    );
  }
  openChangingPasswordModal() {
    this.modalService.open(ChangePasswordFormComponent);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['start-page']);
  }

}
