import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

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
      const error = err.error.message || err.statusText;
      console.log(error);
      return throwError(error);
    }));
 }
}
