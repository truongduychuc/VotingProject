import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../_services/authentication.service";
import {AccountService} from "../_services/account.service";
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public samplePagesCollapsed = true;
  currentUser : any;
  constructor(private router: Router, private authService: AuthenticationService, private accountService: AccountService) {

  }

  ngOnInit() {
    console.log('Inited!');
    this.accountService.getProfile().subscribe(
      user => {
        this.currentUser = user;
        console.log(user);
      }, error1 => {
        console.log(error1);
      }
    );
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
