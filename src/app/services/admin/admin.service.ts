import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
@Injectable()
export class AdminService {
  serverURL = 'http://localhost:8080';
  constructor(private data: DataService,private http: HttpClient) { }

  getAllUsers(): Observable<any>{
    return this.http.get(`${this.serverURL}/users/all`);
  }

  getSingleUser(id): Observable<any>{
    return this.http.get(`${this.serverURL}/users/single/${id}`);
  }

  updateUser(id, user): Observable<any>{
    return this.http.put(`${this.serverURL}/users/update`, user);
  }

  deleteUserFromServer(id): Observable<any>{
    return this.http.delete(`${this.serverURL}/users/delete/server/${id}`);
  }
  deleteUserFromDataBase(id): Observable<any>{
    return this.http.delete(`${this.serverURL}/users/delete/database/${id}`);
  }
}
