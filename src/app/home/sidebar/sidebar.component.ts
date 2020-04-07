import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../_models/user';
import {AccountService} from '../../_services/account.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  currentUser: User;
  userLoaded: boolean;
  currentUserSubscription: Subscription;

  constructor(private accountService: AccountService) {
    this.currentUserSubscription = this.accountService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
      this.userLoaded = true;
    });
  }

  get isEmployeeOrManager() {
    if (!this.currentUser) {
      return false;
    } else {
      if (this.currentUser.role && !(this.currentUser.role.name.toUpperCase() === 'ADMIN')) {
        return true;
      } else {
        return false;
      }
    }
  }

  get showEmployeeOptions() {
    return this.isEmployeeOrManager && this.userLoaded;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

}
