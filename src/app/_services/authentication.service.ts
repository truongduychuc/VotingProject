import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import {User} from '../_models/user';
import {AccountService} from './account.service';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  serverURL = 'http://localhost:4000/';
  loggedInState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggedIn: Observable<boolean> = this.loggedInState.asObservable();

  constructor(private httpClient: HttpClient, private authService: AuthenticationService,
              private accountService: AccountService, private router: Router) {
  }

  login(username: string, password: string) {
    const userTryingToLogin = {
      username: username,
      password: password
    };
    return this.httpClient.post<any>(this.serverURL + 'auth/authenticate', userTryingToLogin).pipe(tap((res) => {
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
    this.accountService.getPersonalProfile().pipe(map((res: any) => res.user)).toPromise().then((user: User) => {
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
