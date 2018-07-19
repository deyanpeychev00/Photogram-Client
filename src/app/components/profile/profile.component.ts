// import component, ElementRef, input and the oninit method from angular core
import { Component, OnInit, ElementRef, Input } from '@angular/core';
// import the file-upload plugin
import {ServerService} from '../../services/server/server.service';
// import the native angular http and respone libraries
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Http, Response} from '@angular/http';

// import the do function to be used with the http library.
import "rxjs/add/operator/do";
// import the map function to be used with the http library
import "rxjs/add/operator/map";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  title = 'Test upload.';
  url = 'http://localhost:3000/upload';
  images = [];

  constructor(private server: ServerService, private http: Http, private el: ElementRef) { }

  ngOnInit() {

  }

  upload() {
    // locate the file element meant for the file upload.
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');

    // get the total amount of files attached to the file input.
    let fileCount: number = inputEl.files.length;

    // create a new fromdata instance
    let formData;
    console.log('upload');
    // check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) {

      for (let i = 0; i < fileCount; i++) {
        // initialize new formdata on every iteration to prevent multiple upload on same files
        formData = new FormData();
        formData.append(inputEl.files.item(i).name, inputEl.files.item(i));
        this.http.post(this.url, formData).map((res:Response) => res.json()).subscribe(
          (data) => {
            if(data.success === true){
              console.log(data);
            }else{
              console.error(data);
            }
            let filename = data.filename;
            this.images.push(filename);
          },
          (error) => console.warn(error));
      }
    }
  }

}
