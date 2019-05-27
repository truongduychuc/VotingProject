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
  selectedSurveyId: number;
  constructor(private surveyService: SurveyService) { }

  ngOnInit() {
    this.surveyService.getListSurveys().subscribe( list => {
      this.surveyList = list;
    }, err => {
      console.log(err);
    });
  }
  getQuestionList(survey_id: number) {
    this.surveyService.getQuestionList(survey_id).subscribe( questionList => {
      this.questionList = questionList;
      console.log(this.questionList);
    }, err => {
      console.log(err);
    });
  }

}
