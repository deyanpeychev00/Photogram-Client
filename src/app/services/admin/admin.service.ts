import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
import {UtilityService} from '../utility/utility.service';
@Injectable()
export class AdminService {
  phpURL = this.util.getServerUrl().remote;
  constructor(private data: DataService,private http: HttpClient, private util: UtilityService) { }

  getAllUsers(): Observable<any>{
    return this.http.get(`${this.phpURL}/api/users/all.php`, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }

  getUserByUsername(username): Observable<any>{
    return this.http.get(`${this.phpURL}/api/users/get-user.php/${username}`, {
      headers: new HttpHeaders()
        .set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }

  updateUser(user): Observable<any>{
    return this.http.put(`${this.phpURL}/api/users/update.php`, user, {
      headers: new HttpHeaders()
        .set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }

  deleteUser(id): Observable<any>{
    return this.http.delete(`${this.phpURL}/api/users/delete.php/${id}`, {
      headers: new HttpHeaders()
        .set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
}
