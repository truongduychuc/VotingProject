import {Injectable} from "@angular/core";
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";
import {AuthenticationService} from "../_services/authentication.service";
import {Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private authService: AuthenticationService) {
  }
 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(evt => {
      if (evt instanceof HttpResponse) {
        if (evt.body && evt.body.success) {
          console.log(evt.body.success.message);
        }
      }
    }),catchError((err:HttpErrorResponse) => {
      if(err.status === 401) {
        this.authService.logout();
      }
      if(err.status === 400) {
        alert(err.error.message);
      }
      if(err.status === 404) {
        alert(err.error.message); //alert, for example: 'User or password is incorrect'
      }
      if(err.status === 403) {
        alert(err.error.message);
      }
      console.log(err);
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
 }
}
