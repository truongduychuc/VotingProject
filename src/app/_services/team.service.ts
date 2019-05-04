import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Team} from '../_models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private serverURL = 'http://localhost:4000/';
  constructor(private httpClient: HttpClient) { }

  getAllTeams(): Observable<Team[]> {
    return this.httpClient.get<Team[]>(this.serverURL + 'users/team');
  }
  getListForNominating(): Observable <any> {
    return this.httpClient.get(this.serverURL + 'users/list_for_nominating');
  }
}
