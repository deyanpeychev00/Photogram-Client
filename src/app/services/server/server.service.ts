import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UtilityService} from '../utility/utility.service';


@Injectable()
export class ServerService {

  serverURL = this.util.getServerUrl().local;

  constructor(private http: HttpClient, private util: UtilityService) { }

  uploadFileToServer(file){
    let formData = new FormData();
    formData.append(file.name, file);
    let result = '';

    return this.http.post(`${this.serverURL}/images/upload/`+localStorage.getItem('username'), formData);
  }

  uploadAvatarToServer(username, file){
    let formData = new FormData();
    formData.append(file.name, file);
    let result = '';

    return this.http.post(`${this.serverURL}/avatar/upload/`+ username, formData);
  }

  getUserAvatar(avatarName){
    return this.http.get(`${this.serverURL}/avatar/get/` + avatarName ,{
        responseType: 'blob',
        headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
