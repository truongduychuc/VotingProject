import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {User} from "../_models/user";
import {AccountService} from "../_services/account.service";

@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate  {
  currentUser: User;
  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.currentUser.subscribe((user:User) => {
      this.currentUser = user;
    })
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.currentUser.role.id !== 1) {
      alert('Unauthorized to access this link!');
      this.router.navigate(['page-not-found']);
      return false;
    }
    return true;
  }
}
