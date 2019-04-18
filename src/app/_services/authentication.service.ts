import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
// A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
import * as moment from "moment";
import * as jwt_decode from "jwt-decode";
import {map} from 'rxjs/operators';
import {User} from "../_models/user";
import {AccountService} from "./account.service";
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  serverURL = 'http://localhost:4000';
  currentUser: User;
  constructor(private httpClient: HttpClient, private authService: AuthenticationService, private accountService: AccountService) { }
  login(username: string, password: string) {
    let userTryingToLogin = {
      username: username,
      password: password
    };
    return this.httpClient.post<any>(this.serverURL + '/users/authenticate',userTryingToLogin,).pipe(map(
      res => {
        this.setSession(res);
        console.log('Authentication result: ' + JSON.stringify(res));
      }
    ));
  }
  private setSession(authenticationResult: any) {
    // authenticationResult is the response got back from back-end after logging in successfully
    const token = authenticationResult.token;
    //decode token to get payload, this part is optional, it's used here just for checking
    const decodedToken = this.getDecodedAccessToken(token);
    console.log('Token: ' + JSON.stringify(decodedToken));
    // set the time when token will be expired
    const expiresAt = moment().add(decodedToken.exp - decodedToken.iat,'second');
    console.log(this.getExpiration());
    this.setToken(token,expiresAt);
    this.setCurrentUser();
  }

  private setToken(token, expiresTime) {
    // storage token to client
    localStorage.setItem('token', token);
    localStorage.setItem('expires_at', JSON.stringify(expiresTime.valueOf()));
  }

  // optional, using for something is relative with localStorage
  private setCurrentUser(): void {
    // get current user's profile from back-end
    this.accountService.getPersonalProfile().subscribe(
      (user:User) => {
        let currentUser:User = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        console.log(localStorage.getItem('currentUser'));
      },error1 => {
        console.log(error1);
      }
    );
  }
  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser'));
  }


  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
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
