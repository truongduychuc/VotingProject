import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiService, IAPIResponse} from './api.service';
import {PastWinner} from '../_models/past-winner';
import {map} from 'rxjs/operators';
import {Award} from '../_models/award';
import {Winner} from '../_models/winner';
import {AwardType} from '../_models/award-type';

interface IAwardsWithTypesResponse extends IAPIResponse {
  awards?: Award[];
  types?: AwardType[];
}

interface IAwardResponse extends IAPIResponse {
  award: Award;
}

interface IAwardTypesResponse extends IAPIResponse {
  types?: AwardType[];
}

@Injectable({
  providedIn: 'root'
})
export class AwardService {

  private parentUrl = '/awards';
  private apis = {
    LIST: this.parentUrl + '/list',
    CREATE: this.parentUrl + '/create',
    UPDATE: this.parentUrl + '/update/',
    FIND_AWARD: this.parentUrl + '/find_an_award',
    CHECK_STATUS: this.parentUrl + '/check_status_voter',
    AWARD_TYPE: this.parentUrl + '/award_type',
    INFO: this.parentUrl + '/info/',
    PAST_WINNER: this.parentUrl + '/past_winner/',
    BREAKDOWN: this.parentUrl + '/breakdown/',
    GET_AWARD: this.parentUrl + '/get_award',
    VOTING: this.parentUrl + '/voting_award',
    UPDATE_RESULT: this.parentUrl + '/update_result',
    FINISH_AWARD: this.parentUrl + '/finish_award',
    WINNER: this.parentUrl + '/winner'
  };

  constructor(private apiService: ApiService) {
  }

  createNewAward(newAward: Object): Observable<IAPIResponse> {
    return this.apiService.post(this.apis.CREATE, newAward);
  }

  // finish award earlier end date
  finishAward(awardId: number): Observable<IAPIResponse> {
    return this.apiService.post(this.apis.FINISH_AWARD, {id: awardId});
  }

  getAwardList(): Observable<IAwardsWithTypesResponse> {
    return this.apiService.get(this.apis.LIST);
  }

  updateAward(id: number, newInfo: Object): Observable<IAPIResponse> {
    return this.apiService.put(this.apis.UPDATE + id, newInfo);
  }

  findAnAwardByType(id: number): Observable<Award> {
    return this.apiService.post(this.apis.FIND_AWARD, {type: id}).pipe(map(res => res.data));
  }

  checkVoterStatus(id_award: number): Observable<IAPIResponse> {
    return this.apiService.post(this.apis.CHECK_STATUS, {id_award: id_award});
  }

  getAwardTypes(): Observable<IAwardTypesResponse> {
    return this.apiService.get(this.apis.AWARD_TYPE);
  }

  getAwardDetail(id_award: number): Observable<Award> {
    return this.apiService.get(this.apis.INFO + id_award).pipe(map(res => res.data));
  }

  getPastWinner(id: number, params?: HttpParams): Observable<PastWinner> {
    return this.apiService.get(this.apis.PAST_WINNER + id, params).pipe(map((res: IAPIResponse) => res.data));
  }

  getRankingBreakDown(id: number, params?: HttpParams): Observable<IAPIResponse> {
    return this.apiService.get(this.apis.BREAKDOWN + id, params);
  }

  getWinner(id_award: number): Observable<Winner> {
    return this.apiService.post(this.apis.WINNER, {id_award: id_award}).pipe(map(res => res.data));
  }

  // awards are taking place
  getAwardComingAbout(): Observable<Award[]> {
    return this.apiService.get(this.apis.GET_AWARD).pipe(map(res => res.data));
  }

  vote(votingResult: Object): Observable<IAPIResponse> {
    return this.apiService.post(this.apis.VOTING, votingResult);
  }

  updateVotingResult(id_award: number): Observable<IAPIResponse> {
    return this.apiService.post(this.apis.UPDATE_RESULT, {id: id_award});
  }
}
