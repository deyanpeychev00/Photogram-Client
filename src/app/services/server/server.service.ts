import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UtilityService} from '../utility/utility.service';


@Injectable()
export class ServerService {

  serverURL = this.util.getServerUrl();

  constructor(private http: HttpClient, private util: UtilityService) { }

  uploadFileToServer(file){
    let formData = new FormData();
    formData.append(file.name, file);
    let result = '';

    return this.http.post(`${this.serverURL}/images/upload/`+localStorage.getItem('username'), formData);
  }
}
