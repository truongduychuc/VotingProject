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


@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private router: Router) {
  }
 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(evt => {
      if (evt instanceof HttpResponse) {
        // if response has no error and takes along message
        if (evt.body && evt.body.message) {
          console.log(evt.body.message);
          // this.notifier.notify('info', evt.body.message);
        }
      }
    }), catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        console.log(err.error.message);
        // this.notifier.notify('error', err.error.message);
        this.router.navigate(['default']);
      }
      if (err.status === 400) {
        // this.notifier.notify('error', err.error.message);
        console.log(err.error.message);
      }
      if (err.status === 404) {
        // this.notifier.notify('error', err.error.message);
        console.log(err.error.message);
        // alert(err.error.message); //alert, for example: 'User or password is incorrect'
      }
      if (err.status === 403) {
        // this.notifier.notify('error', err.error.message);
        console.log(err.error.message);
        // alert(err.error.message);
      }
      console.log(err);
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
 }
}
