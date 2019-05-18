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
        if (evt.body && evt.body.success) {
          console.log(evt.body.success.message);
          // alert(evt.body.success.message);
        }
      }
    }), catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        console.log(err.error.message);
        this.router.navigate(['default']);
      }
      if (err.status === 400) {
        console.log(err.error.message);
      }
      if (err.status === 404) {
        console.log(err.error.message);
        // alert(err.error.message); //alert, for example: 'User or password is incorrect'
      }
      if (err.status === 403) {
        console.log(err.error.message);
        // alert(err.error.message);
      }
      console.log(err);
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
 }
}
