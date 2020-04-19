import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Role} from '../_models/role';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  serverURL = environment.serverUrl;

  constructor(private httpClient: HttpClient) {
  }

  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.serverURL + 'users/role');
  }
}
