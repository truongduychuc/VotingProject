import {Component, OnInit} from '@angular/core';
import {User} from "../../_models/user";
import {AccountService} from "../../_services/account.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public samplePagesCollapsed = true;
  currentUser: User;
  constructor(private accountService: AccountService) {
  }
  get isEmployeeOrManager() {
    if(this.currentUser) {
      if(this.currentUser.role.id === 1){
        return false;
      }
      if(this.currentUser.role.id === 2 ||this.currentUser.role.id === 3){
        return true;
      }
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.accountService.currentUser.subscribe((user:User) => this.currentUser = user);
    console.log(this.currentUser);
  }

}
