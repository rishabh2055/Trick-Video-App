import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { AuthService } from '../_utils/auth.service';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    let authReq = req;
    const token = this.authService.getToken();
    if(token !== null){
      authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`)});
    }
    return next.handle(authReq).pipe(
      catchError((error: any) => {
        if ( error && error.status === 401){
          this.authService.signout();
          this.authService.setUnauthorizedError();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
