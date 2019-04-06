import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../_models/user';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // url of backend
  serverURL = 'http://localhost:4000';

  constructor(private httpClient: HttpClient) {
  }

  registerNewUser(newUser: User): Observable<any> {
    // JSON.stringify: convert object to JSON string
    return this.httpClient.post<User>(this.serverURL + '/users/register', JSON.stringify(newUser), {
      headers: new HttpHeaders({  // the header is included in post req
        'Content-Type': 'application/json',
      })
    });
  }
}
