import { Component, OnInit } from '@angular/core';
import {User} from '../../../_models/user';
import {SurveyService} from '../../../_services/survey.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})
export class SurveyListComponent implements OnInit {
  currentUser: User;
  surveyList: any[];
  constructor(private surveyService: SurveyService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.surveyService.getListSurveys().subscribe( list => {
      this.surveyList = list;
    }, err => {
      console.log(err);
    });
  }
  get isAdmin() {
    return this.currentUser && this.currentUser.position.toUpperCase() === 'ADMIN';
  }
}
