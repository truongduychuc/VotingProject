import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentication.service';
import {User} from '../_models/user';
import {AccountService} from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  currentUser: User;

  constructor(private authService: AuthenticationService, private accountService: AccountService, private router: Router) {
    this.accountService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.currentUser) {
      this.router.navigate(['start-page']);
      return false;
    } else if (!this.currentUser.role) {
      this.router.navigateByUrl('/home/dashboard');
      return false;
    } else {
      if (route.data.roles && route.data.roles.indexOf(this.currentUser.role.id) === -1) {
        alert('Unauthorized to access this link!');
        this.router.navigate(['page-not-found']);
        return false;
      }
      return true;
    }
  }
}
