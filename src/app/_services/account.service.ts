import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {User} from '../_models/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {ApiService, IAPIResponse} from './api.service';

interface INominee {
  id: number;
  english_name: string;
  id_team: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // url of backend
  serverURL = environment.serverUrl;
  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>({
    last_name: '',
    english_name: '',
    username: '',
    first_name: '',
    email: ''
  });
  currentUser: Observable<User> = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    if (!!localStorage.getItem('token')) {
      this.getPersonalProfile().pipe(map((res: any) => res.user)).toPromise().then(user => {
        this.currentUserSubject.next(user);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  registerNewUser(newUser: User): Observable<IAPIResponse> {
    // JSON.stringify: convert object to JSON string
    return this.apiService.post('users/register', newUser);
  }

  changePassword(current_password: string, new_password: string): Observable<IAPIResponse> {
    const changePasswordObj = {
      old_password: current_password,
      new_password: new_password
    };
    return this.apiService.put('users/change_password', changePasswordObj);
  }

  getUserProfileById(id: number): Observable<IAPIResponse> { // for role admin
    return this.apiService.get(`users/profile/${id}`);
  }

  getPersonalProfile(): Observable<IAPIResponse> {  // for role Developer
    return this.apiService.get('users/profile');
  }

  updatePersonalProfile(updateInfo: Object): Observable<IAPIResponse> {
    return this.apiService.put('users/update_profile', updateInfo);
  }

  updateProfileForId(updateInfo: Object, id: number): Observable<IAPIResponse> {
    return this.apiService.put(`users/update/${id}`, updateInfo);
  }

  getUsersList(params?: HttpParams): Observable<IAPIResponse> {
    return this.apiService.get('users/list', params);
  }

  getListNomineesForVoting(id: number): Observable<INominee[]> {
    return this.apiService.post('users/list_for_voting', {id_award: id}).pipe(map(res => res.data));
  }

  resetPassword(id: number) {
    return this.apiService.put(`users/reset_password/${id}`, {});
  }

  deleteUser(id: number) {
    return this.apiService.post(`users/delete/${id}`, {});
  }
}
