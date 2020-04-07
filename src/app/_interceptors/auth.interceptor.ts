import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {  // attach token for every request to backend
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loginToken = localStorage.getItem('token');
    if (loginToken) {
      const SPACE_SYM = ' ';
      const prefix = 'Bearer';
      const cloned = req.clone({
        headers: req.headers.set('Authorization', prefix + SPACE_SYM + loginToken)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
