import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {AccountService} from "../../_services/account.service";
import {User} from "../../_models/user";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public samplePagesCollapsed = true;
  currentUser: User;
  constructor(private router: Router,private authService: AuthenticationService, private accountService: AccountService) {
  }

  ngOnInit() {
    console.log('Inited!');
    /*get personal profile asynchronously, because if you get it from localStorage or something is not observable,
you need to reload the page to see currentUser's properties*/
    this.accountService.getPersonalProfile().subscribe((userProfile:User) => {
      this.currentUser = userProfile;
    }, (err: HttpErrorResponse) => {
      console.log(err + ' status: ' +err.status);
    })
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['start-page']);
  }

}
