import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import {User} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  addNewAppointment(postData){
    return this.http.post<User>(`/api/appointment/add`, postData);
  }

  deleteAppointment(postData){
    return this.http.post<User>(`/api/appointment/delete`, postData);
  }

  getAllAppointments(){
    return this.http.get(`/api/appointment`);
  }
}
