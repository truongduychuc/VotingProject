import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  serverURL = 'http://localhost:4001/surveys/';
  constructor(private httpClient: HttpClient){}
  getListSurveys(): Observable<any> {
    return this.httpClient.get(this.serverURL + 'survey-list');
  }
  createNewSurvey(newSurvey: Object): Observable<any> {
    return  this.httpClient.post(this.serverURL + 'create', newSurvey);
  }
  voteForSurvey(options: Object): Observable<any> {
    return this.httpClient.post(this.serverURL + 'vote', options);
  }
}
