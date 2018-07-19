import { Injectable } from '@angular/core';
declare const M: any;

@Injectable()
export class ToastrService {

  constructor() { }
  toast(text: string, cb?) {
    M.toast({html: text, displayLength: 2000}, cb);
  }

  warningToast(text: string, cb?) {
    M.toast({html: text, displayLength: 2000, classes: 'orange darken-1'}, cb);
  }

  successToast(text: string, cb?) {
    M.toast({html: text, displayLength: 2000, classes: 'green lighten-1'}, cb);
  }

  errorToast(text: string, cb?) {
    M.toast({html: text, displayLength: 2000, classes: 'red lighten-1'}, cb);
  }
}
