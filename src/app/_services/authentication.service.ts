import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
// A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
import * as moment from "moment";
import * as jwt_decode from "jwt-decode";
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  serverURL = 'http://localhost:4000';
  constructor(private httpClient: HttpClient) { }
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
  public setSession(authenticationResult: any) {  // authenticationResult is the response got back from back-end
    /*can not set expiresAt because we are not able to get the value of expiresIn from token,
    (can not access by using authenticationResult.token.expiresIn
    it is included in payload of the token, but the token is decoded. => can't get.*/


    const token = authenticationResult.token;
    //decode token to get payload
    const decodedToken = this.getDecodedAccessToken(token);
    console.log('Token: ' + JSON.stringify(decodedToken));
    // set the time when token will be expired
    const expiresAt = moment().add(decodedToken.exp - decodedToken.iat,'second');

    let currentUser = {
      id: authenticationResult.id,
      username: authenticationResult.username,
      first_name: authenticationResult.first_name,
      last_name: authenticationResult.last_name,
      english_name: authenticationResult.english_name,
      position: authenticationResult.position,
    };
    this.setAfterLogin(currentUser,token, expiresAt);
    console.log(this.getExpiration());
  }

  setAfterLogin(user,token,expiresTime) {
    // storage token and currentUser to localstorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token );
    localStorage.setItem('expires_at', JSON.stringify(expiresTime.valueOf()));
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
  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
  private getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }catch (Error) {
      console.log(Error);
      return null;
    }
  }
}
