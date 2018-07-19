import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
@Injectable()
export class AdminService {
  kinvey = this.data.getKinveyCredentials();
  constructor(private data: DataService,private http: HttpClient) { }

  getAllUsers(): Observable<any>{
    return this.http.get(`${this.kinvey.host}/user/${this.kinvey.appKey}/`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getCurrentUserBlockStatus(id): Observable<any>{
    return this.http.get(`${this.kinvey.host}/user/${this.kinvey.appKey}/${id}?query={}&filter=blocked`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  updateUser(id, user): Observable<any>{
    return this.http.put(`${this.kinvey.host}/user/${this.kinvey.appKey}/${id}`, user, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  deleteUser(id): Observable<any>{
    return this.http.delete(`${this.kinvey.host}/user/${this.kinvey.appKey}/${id}?hard=true`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }
}
