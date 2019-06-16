import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {AuthenticationService} from '../../_services/authentication.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentUser: User;
  constructor() {
   this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   // console.log(this.currentUser);
  }
  get isEmployeeOrManager() {
    if (!this.currentUser) {
      return false;
    } else {
      if (!(this.currentUser.position.toUpperCase() === 'ADMIN')) {
        return true;
      } else {
        return false;
      }
    }
  }

  ngOnInit() {

  }

}
