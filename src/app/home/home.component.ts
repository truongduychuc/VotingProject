import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {User} from '../_models/user';
import {AccountService} from '../_services/account.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './home.component.html',
  styleUrls: ['../app.component.scss', './home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(private notifier: NotifierService, private accountService: AccountService) {
  }

  ngOnInit() {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngAfterViewInit(): void {
    this.accountService.currentUser.subscribe(user => {
      if (user.english_name) {
        this.notifier.notify('info', 'Welcome ' + this.currentUser.english_name + '!');
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }
}
