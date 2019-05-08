import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Award} from '../_models/award';
import {PastWinner} from '../_models/past-winner';


@Injectable({
  providedIn: 'root'
})
export class AwardService {
  serverURL = 'http://localhost:4000/awards/';
  constructor(private httpClient: HttpClient) {

  }
  createNewAward(newAward: Object) {
    return this.httpClient.post(this.serverURL + 'create', newAward);
  }

  getAwardList(): Observable<Award[]> {
    return this.httpClient.get<Award[]>(this.serverURL + 'list');
  }
  updateAward(id: number, newInfo: Object) {
    return this.httpClient.put(this.serverURL + `update/${id}`, newInfo);
  }
  uploadLogo(id: number, file: File): Observable<any> {
    return this.httpClient.post(this.serverURL + `upload_logo/${id}`, {logo: file});
  }
  getAwardTypes(): Observable<any> {
    return this.httpClient.get(this.serverURL + 'award_type');
  }
  getAwardDetail(id: number): Observable<Award> {
    return this.httpClient.get<Award>(this.serverURL + `info/${id}`);
  }
  getPastWinner(id: number, params?: HttpParams): Observable<PastWinner> {
    return this.httpClient.get<PastWinner>(this.serverURL + `past_winner/${id}`, {params: params});
  }
  getRankingBreakDown(id: number, params?: HttpParams) {
    return this.httpClient.get(this.serverURL + `breakdown/${id}`, {params: params});
  }
  // awards are taking place
  getAwardComingAbout() {
    return this.httpClient.get(this.serverURL + 'get_award');
  }
  vote(votingResult: Object) {
    return this.httpClient.post(this.serverURL + 'voting_award', votingResult);
  }
}
