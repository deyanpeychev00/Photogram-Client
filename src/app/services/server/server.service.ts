import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class ServerService {

  constructor(private http: HttpClient) { }

  uploadFileToServer(file){
    let formData = new FormData();
    formData.append(file.name, file);
    let result = '';

    return this.http.post('http://localhost:8080/images/upload', formData);
  }
}
