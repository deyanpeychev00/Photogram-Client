import {Injectable} from '@angular/core';

@Injectable()
export class DataService {

  constructor() {
  }

  getAPI() {
    return {
      avatars: 'https://photogram.sliven.org/uploads/avatars/',
      uploads: 'https://photogram.sliven.org/uploads/users/'
    };
  }

  setUserLocalData(data) {
    if (data.roles.length > 0) {
      localStorage.setItem('role', data.roles[0]);
    } else {
      localStorage.setItem('role', 'init');
    }

    localStorage.setItem('authtoken', data.auth_token || '');
    localStorage.setItem('username', data.username);
    localStorage.setItem('userId', data.id);
    localStorage.setItem('logged', 'true');
    localStorage.setItem('status', data.blocked);
  }

  removeLocalData() {
    localStorage.clear();
    return false;
  }
}
