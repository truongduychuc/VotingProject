import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
import * as moment from "moment";
import * as jwt_decode from "jwt-decode";
import {map} from 'rxjs/operators';
import {User} from "../_models/user";
import {AccountService} from "./account.service";
import {Router} from "@angular/router";
import {stringify} from 'querystring';
import {BehaviorSubject, Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  serverURL = 'http://localhost:4000';
  constructor(private httpClient: HttpClient, private authService: AuthenticationService,
              private accountService: AccountService, private router: Router) {
  }
  login(username: string, password: string) {
    let userTryingToLogin = {
      username: username,
      password: password
    };
    return this.httpClient.post<any>(this.serverURL + '/users/authenticate', userTryingToLogin).pipe(map(
      res => {
        this.setSession(res);
        console.log('Authentication result: ' + JSON.stringify(res));
      }
    ));
  }

  private setSession(authenticationResult: any) {
    // authenticationResult is the response got back from back-end after logging in successfully
    const token = authenticationResult.token;
    // decode token to get payload, this part is optional, it's used here just for checking
    const decodedToken = this.getDecodedAccessToken(token);
    console.log('Token: ' + JSON.stringify(decodedToken));
    // set the time when token will be expired
    const expiresAt = moment().add(decodedToken.exp - decodedToken.iat, 'second');
    console.log(this.getExpiration());

    const currentUser = <User> {
      first_name: authenticationResult.first_name,
      last_name: authenticationResult.last_name,
      english_name: authenticationResult.last_name,
      position: authenticationResult.position
    }
    this.setToken(token, expiresAt);
    this.setCurrentUser(currentUser);
    console.log(JSON.parse(localStorage.getItem('currentUser')));
  }

  private setToken(token, expiresTime) {
    // storage token to client
    localStorage.setItem('token', token);
    localStorage.setItem('expires_at', JSON.stringify(expiresTime.valueOf()));
  }

  // optional, using for something is relative with localStorage
  private setCurrentUser(currentUser: User): void {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }


  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    this.router.navigate(['start-page']);
    console.log('Logged out!');

  }
  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }
  isLoggedOut() {
    return !this.isLoggedIn();
  }

  // get the time token will be expired
  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  // for jwt decoding, this is optional
  private getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }catch (Error) {
      console.log(Error);
      return null;
    }
  }
}
