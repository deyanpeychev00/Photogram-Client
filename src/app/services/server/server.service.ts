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

    return this.http.post('http://localhost:8080/images/upload', formData)/*.subscribe(data => {
      let response: any = data;
      result = response.data.filename;

      if(result === ''){
        return { success: false, msg: 'Възникна грешка при качването на снимките. Моля опитайте отново'};
      }
      return {success: true, filename: result, msg: 'Снимката е качена успешно'};
    })*/;
  }
}
