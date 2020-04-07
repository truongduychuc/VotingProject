import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import {map, tap} from 'rxjs/operators';
import {User} from '../_models/user';
import {AccountService} from './account.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  serverURL = 'http://localhost:4000/';

  constructor(private httpClient: HttpClient, private authService: AuthenticationService,
              private accountService: AccountService, private router: Router) {
  }

  login(username: string, password: string) {
    const userTryingToLogin = {
      username: username,
      password: password
    };
    return this.httpClient.post<any>(this.serverURL + 'auth/authenticate', userTryingToLogin).pipe(tap((res) => {
      this.setSession(res);
      this.getProfile();
    }));
  }

  private setSession(authenticationResult: any) {
    const token = authenticationResult.token;
    this.setToken(token);
  }

  private getProfile(): void {
    this.accountService.getPersonalProfile().pipe(map((res: any) => res.user)).toPromise().then((user: User) => {
      this.accountService.currentUserSubject.next(user);
    }).catch(err => {
      console.log(err);
    });
  }

  private setToken(token: string, expiresTime?: number) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    this.router.navigate(['start-page']);
    // console.log('Logged out!');
    this.accountService.currentUserSubject.next({
      last_name: '',
      english_name: '',
      username: '',
      first_name: '',
      email: ''
    });
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
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
    try {
      return jwt_decode(token);
    } catch (Error) {
      console.log(Error);
      return null;
    }
  }
}
