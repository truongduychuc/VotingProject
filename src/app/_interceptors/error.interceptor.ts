import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private authService: AuthenticationService) {
  }
 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((err:HttpErrorResponse) => {
      if(err.status === 401) {
        this.authService.logout();
        location.reload(true);
      }
      if(err.status === 400) {
        alert(err.error.message);
      }
      if(err.status === 404) {
        alert(err.error.message); //alert, for example: 'User or password is incorrect'
      }
      if(err.status === 403) {
        alert(err.error);
      }
      const error = err.error.message || err.statusText;
      console.log('Interceptor: ' + error);
      return throwError(error);
    }));
 }
}
