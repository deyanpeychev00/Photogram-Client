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
      localStorage.setItem('role', data._id);
    } else {
      localStorage.setItem('role', 'init');
    }
    localStorage.setItem('authtoken', data._kmd.authtoken);
    localStorage.setItem('username', data.username);
    localStorage.setItem('userId', data._id);
    localStorage.setItem('logged', 'true');
    localStorage.setItem('status', 'false');
  }

  removeLocalData() {
    localStorage.clear();
    return false;
  }

  b64toBlob(b64Data, contentType='image/jpeg', sliceSize=512){
    const byteCharacters = atob(b64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}
