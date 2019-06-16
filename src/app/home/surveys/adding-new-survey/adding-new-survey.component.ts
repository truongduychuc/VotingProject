import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SurveyService} from '../../../_services/survey.service';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';

@Component({
  selector: 'app-adding-new-survey',
  templateUrl: './adding-new-survey.component.html',
  styleUrls: ['./adding-new-survey.component.scss']
})
export class AddingNewSurveyComponent implements OnInit {
  addSurvey: FormGroup;
  constructor(private formBuilder: FormBuilder, private surveyService: SurveyService, private notifier: NotifierService, private router: Router) { }

  ngOnInit() {
    this.addSurvey = this.formBuilder.group({
      survey_title: ['', Validators.required],
      questions: this.formBuilder.array([this.createQuestion()])
    });
  }
  createQuestion() {
    return this.formBuilder.group({
      question_title: ['', Validators.required],
      answers: this.formBuilder.array([this.createAnswer(), this.createAnswer()])
    });
  }
  createAnswer() {
    return this.formBuilder.group({
      answer_title: ['', Validators.required]
    });
  }
  addQuestion() {
    const questions = this.addSurvey.get('questions') as FormArray;
    questions.push(this.createQuestion());
  }
  addOption(question) {
    question.get('answers').push(this.createAnswer());
  }
  answersControls(question) {
    return question.get('answers').controls;
  }
  onSubmit() {
    console.log(this.addSurvey.value);
    console.log(this.addSurvey);
    if (this.addSurvey.invalid) {
      return;
    }
    this.surveyService.createNewSurvey(this.addSurvey.value).subscribe(successRes => {
      this.router.navigateByUrl('/home/surveys/list');
      if (successRes.hasOwnProperty('message')) {
        this.notifier.notify('info', successRes.message);
      }
    }, errMessage => {
      if (typeof errMessage  === 'string') {
        this.notifier.notify('error', errMessage);
      }
    });
  }
}
