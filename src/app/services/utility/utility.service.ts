import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {

  constructor() { }

  getServerUrl() {
    return `http://localhost:8080`;
  }
}
