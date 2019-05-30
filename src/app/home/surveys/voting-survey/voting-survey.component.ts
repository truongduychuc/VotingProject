import { Component, OnInit } from '@angular/core';
import {SurveyService} from '../../../_services/survey.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-voting-survey',
  templateUrl: './voting-survey.component.html',
  styleUrls: ['./voting-survey.component.scss']
})
export class VotingSurveyComponent implements OnInit {
  surveyList: any[];
  questionList: any[];
  selectedSurveyId: number;
  votingSurvey: FormGroup;
  constructor(private surveyService: SurveyService, private formBuilder: FormBuilder, private notifier: NotifierService) { }

  ngOnInit() {
    this.surveyService.getListSurveys().subscribe( list => {
      this.surveyList = list;
    }, err => {
      console.log(err);
    });
    this.generateForm();
  }
  generateForm() {
    this.votingSurvey = this.formBuilder.group({
      survey_id: [this.selectedSurveyId],
      answers: this.formBuilder.array([this.createAnswer()])
    });
  }
  createAnswer() {
    return this.formBuilder.group({
      id: ['', Validators.required]
    });
  }
  getQuestionList(survey_id: number) {
    this.surveyService.getQuestionList(survey_id).subscribe( questionList => {
      this.questionList = questionList;
      // console.log(this.questionList);
      const answers = this.votingSurvey.get('answers') as FormArray;
      this.questionList.forEach( (question, index) => {
        if (index < this.questionList.length - 1) {
          answers.push(this.createAnswer());
        } else {
          return;
        }
      });
    }, err => {
      console.log(err);
    });
  }
  onSubmit() {
    console.log(this.votingSurvey.value);
    if (this.votingSurvey.invalid) {
      return;
    }
    this.surveyService.voteForSurvey(this.votingSurvey.value).subscribe( success => {
      this.notifier.notify('info', 'Voted successfully!');
    }, err => {
      console.log(err);
    });
  }
}
