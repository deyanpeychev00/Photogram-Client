import {Injectable} from '@angular/core';

@Injectable()
export class DataService {

  constructor() {
  }

  getKinveyCredentials() {
    return {
      host: 'https://baas.kinvey.com',
      appKey: 'kid_SkTVZzDAz',
      appSecret: '6e521a85c8ee4f30a0d5281f9cd8c54e',
    };
  }

  setUserLocalData(data) {
    if (data.roles.length > 0) {
      localStorage.setItem('role', data.roles[0]);
    } else {
      localStorage.setItem('role', 'init');
    }
    localStorage.setItem('authtoken', data.auth_token || "");
    localStorage.setItem('username', data.username);
    localStorage.setItem('userId', data.id);
    localStorage.setItem('logged', 'true');
    localStorage.setItem('status', 'false');
  }

  removeLocalData() {
    localStorage.clear();
    return false;
  }
}
