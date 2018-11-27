import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {

  constructor() { }

  getServerUrl() {
    return {
      local: `http://localhost:8080`,
      remote: `https://photogram.sliven.org`
    };
  }
}
