import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../_services/authentication.service";
import {AccountService} from "../_services/account.service";
import {map} from 'rxjs/operators';
import {User} from "../_models/user";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public samplePagesCollapsed = true;
  currentUser : User;
  constructor(private router: Router, private authService: AuthenticationService, private accountService: AccountService) {
    this.initProfileInfo();
  }

  ngOnInit() {
    console.log('Inited!');
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
  initProfileInfo() {
    this.accountService.getProfile().subscribe(
      (user: User) => {
        this.currentUser = user;
        console.log(user);
      }, error1 => {
        console.log(error1);
      }
    );
  }

}
