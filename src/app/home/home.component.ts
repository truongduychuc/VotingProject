import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {User} from '../_models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './home.component.html',
  styleUrls: ['../app.component.scss', './home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentUser: User;
  constructor(private notifier: NotifierService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.notifier.notify('info', 'Welcome ' + this.currentUser.english_name + '!');
  }

}
