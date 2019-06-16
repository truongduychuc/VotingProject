import { Component, OnInit } from '@angular/core';
import {SurveyService} from '../../_services/survey.service';
import {User} from '../../_models/user';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.scss']
})
export class SurveysComponent implements OnInit {
  currentUser: User;
  constructor(private surveyService: SurveyService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
  }
  get isAdmin() {
    return this.currentUser && this.currentUser.position.toUpperCase() === 'ADMIN';
  }

}
