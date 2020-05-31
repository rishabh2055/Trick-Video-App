import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  getAllDoctorsDepartment(){
    return this.http.get(`/api/doctor/department/all`);
  }

  updateDoctorProfile(postData, uid){
    return this.http.post(`/api/doctor/${uid}`, postData);
  }
}
