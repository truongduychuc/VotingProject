import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {AuthenticationService} from '../_services/authentication.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private authService: AuthenticationService;

  constructor(private router: Router, private injector: Injector, private notifier: NotifierService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(evt => {
      if (evt instanceof HttpResponse) {
        // if response has no error and takes along message
        if (evt.body && evt.body.message) {
        }
      }
    }), catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        this.authService = this.injector.get(AuthenticationService);
        this.notifier.notify('error', 'Session expired, please log in again.');
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
