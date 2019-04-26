import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../_models/user';
import {BehaviorSubject, Observable} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // url of backend
  serverURL = 'http://localhost:4000';
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue() : User {
    return this.currentUserSubject.value;
  }
  registerNewUser(newUser: User):Observable<any> {
    // JSON.stringify: convert object to JSON string
    return this.httpClient.post<any>(this.serverURL + '/users/register', newUser);
  }
  changePassword(current_password: string, new_password: string) {
    let changePasswordObj = {
      old_password: current_password,
      new_password: new_password
    }
    console.log(changePasswordObj);
    return this.httpClient.put(this.serverURL + '/users/change_password', changePasswordObj);
  }
  getUserProfileById(id: number): Observable<any>{ // for role admin
    return this.httpClient.get(this.serverURL + `/users/profile/${id}`);
  }
  getPersonalProfile(): Observable<any> {  // for role Developer
    return this.httpClient.get(this.serverURL + '/users/profile');
  }
  updatePersonalProfile(updateInfo: Object) { // for role Developer
    return this.httpClient.put(this.serverURL + '/users/update_profile', updateInfo);
  }
  updateProfileForId(updateInfo: Object, id: number) {
    return this.httpClient.put(this.serverURL + `/users/update/${id}`, updateInfo);
  }
  getUsersList(params?: HttpParams): Observable<any> {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // passed
      console.log(params);
      let apiURL: string;
      if(currentUser.role.id === 1) {
        apiURL = '/users/list/admin';
      }
      else {
        apiURL = '/users/list/';
      }
      return this.httpClient.get(this.serverURL + apiURL, {
        params
      });
  }
  resetPassword(id: number) {
    return this.httpClient.put(this.serverURL + `/users/reset_password/${id}`, {});
  }
  deleteUser(id: number) {
    return this.httpClient.post(this.serverURL + `/users/delete/${id}`, {});
  }
}
