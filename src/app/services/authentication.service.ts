import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }
  setToken(token: string) {
    localStorage.setItem('TOKEN', token);
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('TOKEN');
    return token != null;
  }
}
