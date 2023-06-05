import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export class NotAuthenticatedError { }

@Injectable()
export class MoneyHttpInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Entrou no interceptor");

    if(req) {
      console.log("res no interceptor", req);
    }

    if(req.url.includes("/reset-password")){
      console.log("Caiu no /reset-password");
      return next.handle(req);
      
    }

    if(req.url.includes("/forgot-password")){
      console.log("Caiu no forgot-password");
      return next.handle(req);
      
    }
    
    if (!req.url.includes('/oauth/token') && (req.url.includes("/forgot-password") || req.url.includes("/reset-password")) && this.auth.isAccessTokenInvalido()) {
      console.log("isAccessTokenInvalido", this.auth.isAccessTokenInvalido);
      return from(this.auth.obterNovoAccessToken())
        .pipe(
          mergeMap(() => {
            if (this.auth.isAccessTokenInvalido()) {
              throw new NotAuthenticatedError();
            }

            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });

            return next.handle(req);
          })
        );
    }

    return next.handle(req);
  }

}