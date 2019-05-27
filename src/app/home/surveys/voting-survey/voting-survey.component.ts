import { Component, OnInit } from '@angular/core';
import {SurveyService} from '../../../_services/survey.service';

@Component({
  selector: 'app-voting-survey',
  templateUrl: './voting-survey.component.html',
  styleUrls: ['./voting-survey.component.scss']
})
export class VotingSurveyComponent implements OnInit {
  surveyList: any[];
  questionList: any[];
  constructor(private surveyService: SurveyService) { }

  ngOnInit() {
    this.surveyService.getListSurveys().subscribe( list => {
      this.surveyList = list;
      console.log(this.surveyList);
    }, err => {
      console.log(err);
    });
  }

}
