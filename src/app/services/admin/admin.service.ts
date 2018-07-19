import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
@Injectable()
export class AdminService {
  kinvey = this.data.getKinveyCredentials();
  serverURL = 'http://localhost:8080';
  constructor(private data: DataService,private http: HttpClient) { }

  getAllUsers(): Observable<any>{
    return this.http.get(`${this.serverURL}/users/all`);
  }

  getSingleUser(id): Observable<any>{
    return this.http.get(`${this.serverURL}/users/single/${id}`);
  }

  updateUser(id, user): Observable<any>{
    console.log(user);
    return this.http.put(`${this.serverURL}/users/update`, user);
  }

  deleteUser(id): Observable<any>{
    return this.http.delete(`${this.kinvey.host}/user/${this.kinvey.appKey}/${id}?hard=true`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }
}
