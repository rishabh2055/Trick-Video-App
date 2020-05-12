import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import {User} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  registerNewUser(postData){
    return this.http.post<User>(`/api/user/signup`, postData);
  }

  getLoggedInUserDetails(user){
    return this.http.get<User>(`/api/user/${user.uid}/me`);
  }
}
