import {Injectable} from '@angular/core';

@Injectable()
export class DataService {
  protocol = 'https';
  host = 'photogram.sliven.org';

  constructor() {}

  getAPI() {
    return {
      avatars: `${this.protocol}://${this.host}/uploads/avatars/`,
      uploads: `${this.protocol}://${this.host}/uploads/users/`
    };
  }
  getDomainDetails(){
    return {protocol: this.protocol, host: this.host};
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
