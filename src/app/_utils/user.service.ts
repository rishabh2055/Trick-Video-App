import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  registerNewUser(postData){
    return this.http.post<User>(`/api/user/signup`, postData);
  }

  getUserDetails(uid){
    return this.http.get<User>(`/api/user/${uid}`);
  }

  uploadImage(formData){
    return this.http.post<User>(`/api/user/upload`, formData);
  }
}
