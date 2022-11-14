import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const tokenString = localStorage.getItem('token');

    const url = request.url;

    if( tokenString && ( !url.endsWith('/api/auth/signin') || !url.endsWith('/api/auth/signup') )){
      const token = JSON.parse(tokenString);
      const jwt = token.token;
      request = request.clone({
        setHeaders : {
          Authorization: 'Bearer ' + jwt
        }
      })
    }

    return next.handle(request);
  }
}
