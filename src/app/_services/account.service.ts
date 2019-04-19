import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../_models/user';
import {Observable} from 'rxjs';
import {Role} from "../_models/role";


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // url of backend
  serverURL = 'http://localhost:4000';

  constructor(private httpClient: HttpClient) {
  }

  registerNewUser(newUser: User):Observable<any> {
    // JSON.stringify: convert object to JSON string
    return this.httpClient.post<User>(this.serverURL + '/users/register', newUser);
  }

  changePassword(current_password: string, new_password: string) {
    let changePasswordObj = {
      old_password: current_password,
      new_password: new_password
    }
    console.log(changePasswordObj);
    return this.httpClient.put(this.serverURL + '/users/change_password', changePasswordObj);
  }
  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.serverURL + '/users/role');
  }
  getPersonalProfile(): Observable<any> {
    return this.httpClient.get(this.serverURL + '/users/profile');
  }
  updatePersonalProfile(updateInfo: Object) {
    return this.httpClient.put(this.serverURL + '/users/update_profile', updateInfo);
  }
  getOtherProfile(id:number) {

  }
  getUsersList(params?: HttpParams): Observable<any> {
    console.log(params);
      return this.httpClient.get(this.serverURL + '/users/list', {
        params
      });
  }
  getAllUsers(): Observable<any>{
    return this.httpClient.get(this.serverURL + '/users/list');
  }
  deleteUser(id: number) {
    return this.httpClient.post(this.serverURL + `/users/delete/${id}`, {});
  }
}
