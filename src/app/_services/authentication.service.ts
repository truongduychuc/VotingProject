import {Injectable} from '@angular/core';
import {map, retry, tap} from 'rxjs/operators';
import {User} from '../_models/user';
import {AccountService} from './account.service';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  serverURL = environment.serverUrl;

  loggedInState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggedIn: Observable<boolean> = this.loggedInState.asObservable();

  constructor(private apiService: ApiService,
              private authService: AuthenticationService,
              private accountService: AccountService,
              private router: Router
  ) {
  }

  login(username: string, password: string) {
    const userTryingToLogin = {
      username: username,
      password: password
    };
    return this.apiService.post('auth/authenticate', userTryingToLogin).pipe(tap((res) => {
      this.loggedInState.next(true);
      this.setSession(res);
      this.getProfile();
    }));
  }

  private setSession(authenticationResult: any) {
    const token = authenticationResult.token;
    this.setToken(token);
  }

  private getProfile(): void {
    this.accountService.getPersonalProfile().pipe(map((res: any) => res.user), retry(1)).toPromise().then((user: User) => {
      this.accountService.currentUserSubject.next(user);
    }).catch(err => {
      console.log(err);
    });
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/start-page');
    this.loggedInState.next(false);
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
}
