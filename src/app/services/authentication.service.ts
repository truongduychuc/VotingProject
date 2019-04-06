import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import * as moment from "moment";
import * as jwt_decode from "jwt-decode";

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
    return this.httpClient.post<any>(this.serverURL + '/users/authenticate',userTryingToLogin);
  }
  public setSession(authenticationResult: any) {
    /*can not set expiresAt because we are not able to get the value of expiresIn from token,
    (can not access by using authenticationResult.token.expiresIn
    it is included in payload of the token, but the token is decoded. => can't get.*/
    //
    const decodedToken = this.getDecodedAccessToken(authenticationResult.token);
    console.log('Token: ' + JSON.stringify(decodedToken));
    console.log('Exp' + decodedToken.exp);
    const expiresAt = moment().add(decodedToken.exp,'second');
    localStorage.setItem('username_token', authenticationResult.username);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
  }
  logout() {
    localStorage.removeItem('username_token');
    localStorage.removeItem('expires_at');
  }
  isLoggedIn() {
    let now = moment();
    console.log('Now is '+ now);
    return moment().isBefore(this.getExpiration());
  }
  isLoggedOut() {
    return !this.isLoggedIn();
  }
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
