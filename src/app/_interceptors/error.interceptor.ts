import {Injectable} from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {NotifierService} from 'angular-notifier';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private router: Router, private authService: AuthenticationService, private notifier: NotifierService) {
  }
 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(evt => {
      if (evt instanceof HttpResponse) {
        // if response has no error and takes along message
        if (evt.body && evt.body.message) {}
      }
    }), catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        this.notifier.notify('error', 'Unauthorized, please log in again.');
        this.authService.logout();
        this.router.navigateByUrl('/start-page').then(() => {
          console.log('Success falling back to login page');
        });
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
 }
}
