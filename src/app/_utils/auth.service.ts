import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import {User} from '../models';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  authenticate(postData){
    return this.http.post<User>(`/api/user/login`, postData);
  }

  signout(){
    localStorage.clear();
  }

  saveToken(token: string){
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string{
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean{
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  saveUser(user){
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, user);
  }

  getUser(){
    return localStorage.getItem(USER_KEY);
  }
}
