import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../_services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate  {
  constructor(private authService: AuthenticationService, private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      console.log('there\'s no current user, route to start page!');
      this.router.navigate(['start-page']);
      return false;
    } else {
      if (route.data.roles && route.data.roles.indexOf(currentUser.position) === -1) {
        console.log(route.data.roles);
        console.log(currentUser.position);
        alert('Unauthorized to access this link!');
        this.router.navigate(['page-not-found']);
        return false;
      }
      return true;
    }
  }
}
