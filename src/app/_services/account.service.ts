import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../_models/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // url of backend
  serverURL = 'http://localhost:4000/';
  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>({
    last_name: '',
    english_name: '',
    username: '',
    first_name: '',
    email: ''
  });
  currentUser: Observable<User> = this.currentUserSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    if (!!localStorage.getItem('token')) {
      this.getPersonalProfile().pipe(map((res: any) => res.user)).toPromise().then(user => {
        this.currentUserSubject.next(user);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  registerNewUser(newUser: User): Observable<any> {
    // JSON.stringify: convert object to JSON string
    return this.httpClient.post<any>(this.serverURL + 'users/register', newUser);
  }

  changePassword(current_password: string, new_password: string) {
    const changePasswordObj = {
      old_password: current_password,
      new_password: new_password
    };
    return this.httpClient.put(this.serverURL + 'users/change_password', changePasswordObj);
  }

  getUserProfileById(id: number): Observable<any> { // for role admin
    return this.httpClient.get(this.serverURL + `users/profile/${id}`);
  }

  getPersonalProfile(): Observable<any> {  // for role Developer
    return this.httpClient.get(this.serverURL + 'users/profile');
  }

  updatePersonalProfile(updateInfo: Object) { // for role Developer
    return this.httpClient.put(this.serverURL + 'users/update_profile', updateInfo);
  }

  updateProfileForId(updateInfo: Object, id: number) {
    return this.httpClient.put(this.serverURL + `users/update/${id}`, updateInfo);
  }

  getUsersList(params?: HttpParams): Observable<any> {
    return this.httpClient.get(this.serverURL + 'users/list', {params});
  }

  getListNomineesForVoting(id: number): Observable<any> {
    return this.httpClient.post(this.serverURL + 'users/list_for_voting', {id_award: id});
  }

  resetPassword(id: number) {
    return this.httpClient.put(this.serverURL + `users/reset_password/${id}`, {});
  }

  deleteUser(id: number) {
    return this.httpClient.post(this.serverURL + `users/delete/${id}`, {});
  }
}
