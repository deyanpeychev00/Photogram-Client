import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {DataService} from '../data/data.service';
import {Router} from '@angular/router';
import {ToastrService} from '../toastr/toastr.service';
import {AdminService} from '../admin/admin.service';

@Injectable()
export class AuthService {

  emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private http: HttpClient, private dataService: DataService, private router: Router, private toastr: ToastrService, private admin: AdminService) {
  }

  validateRegisterForm(username, email, password, repeatedPassword, firstName, lastName) {
    // check username
    if (username === '' || username === null || username === undefined || username.length < 6) {
      return {
        success: false, error: 'Потребителското име трябва да е минимум 6 символа.'
      };
    }
    // check email
    if (!this.emailRegex.test(email) || email === '' || email === null || email === undefined) {
      return {
        success: false, error: 'Невалиден имейл.'
      };
    }
    // check first name
    if (firstName === '' || firstName === null || firstName === undefined) {
      return {
        success: false, error: 'Моля въведете вашето име.'
      };
    }
    // check last name
    if (lastName === '' || lastName === null || lastName === undefined) {
      return {
        success: false, error: 'Моля въведете вашата фамилия.'
      };
    }
    // check password
    if (password === '' || password === null || password === undefined || password.length < 6) {
      return {
        success: false, error: 'Паролата трябва да е минимум 6 символа.'
      };
    }
    // check password matching
    if (password !== repeatedPassword) {
      return {
        success: false, error: 'Паролите не съвпадат.'
      };
    }

    return {
      success: true, error: ''
    };
  }

  isLogged() {
    return localStorage.getItem('logged') === 'true';
  }

  isAdmin() {
    if (localStorage.getItem('role')) {
      return localStorage.getItem('role') !== 'init';
    }
    return false;
  }

  isBlocked() {
    return localStorage.getItem('status') === 'true';
  }

  pathProtector() {
    if (this.isLogged()) {
      this.router.navigate(['/']);
      this.toastr.errorToast('Нямате достъп до този адрес.');
    }
  }

  pathAuthProtector() {
    if (!this.isLogged()) {
      this.router.navigate(['/login']);
      this.toastr.errorToast('Моля влезте, за да продължите.');
      return false;
    }

    return true;
  }

  pathAdminProtector() {
    if (!this.isAdmin()) {
      this.router.navigate(['/']);
      this.toastr.errorToast('Нямате достъп до този адрес.');

      return false;
    }

    return true;
  }

  blockProtector() {
    this.admin.getSingleUser(localStorage.getItem('userId')).subscribe(userData => {
      if (userData.data[0].blocked === true) {
        this.router.navigate(['/']);
        this.toastr.errorToast('Вашият профил е блокиран. Не можете да създавате пътешествия.');
        return false;
      }
      return true;
    }, err => {
      this.toastr.errorToast('Възникна грешка, моля опитайте отново');
      return false;
    });

    return true;
  }

  validatePostPicture(file) {
    if (file.size > 10 * 1000000) {
      return {
        isValid: false, msg: 'Снимката трябва да е под 10MB.'
      };
    }
    return {
      isValid: true, msg: ''
    };
  }

  validateCreateJourney(name, description, images) {
    if (name === undefined || name === null || name === '') {
      return {
        isValid: false, msg: 'Невалидно име.'
      };
    }
    if (description === undefined || description === null || description === '') {
      return {
        isValid: false, msg: 'Невалидно описание.'
      };
    }
    if (images === undefined || images === null || images.length <= 0) {
      return {
        isValid: false, msg: 'Моля качете вашите снимки.'
      };
    }

    return {
      isValid: true, msg: ''
    };
  }

  // Requests to server
  register(username, email, password, firstName, lastName) {
    const body = {username, password, firstName, lastName, email, journeys: [], roles: [], blocked: false};
    const save = {username, email, firstName, lastName, roles: [], blocked: false, UID: ''};

    this.http.get('http://localhost:8080/api').subscribe(responseData => {
      let response: any = responseData;
      this.http.post(`${response.host}/user/${response.key}/`, body, {
        headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(`${response.key}:${response.secret}`))
          .set('Content-Type', 'application/json')
      }).subscribe((registerData: any) => {
        this.dataService.setUserLocalData(registerData);
        this.toastr.successToast('Добре дошли в Photogram!');
        this.router.navigate(['/journeys/discover']);
        save.UID = registerData._id;
        this.http.post('http://localhost:8080/user/save', save).subscribe(saveData => {});
        this.http.get('http://localhost:8080/storage/'+ localStorage.getItem('username')).subscribe();
      });
    });
  }

  login(username, password) {

    const body = {username, password};

    this.http.get('http://localhost:8080/api').subscribe(responseData => {
      let response: any = responseData;
      this.http.post(`${response.host}/user/${response.key}/login`, body, {
        headers: new HttpHeaders().set('Authorization', 'Basic ' + btoa(`${response.key}:${response.secret}`))
          .set('Content-Type', 'application/json')
      }).subscribe((loginData: any) => {
        this.dataService.setUserLocalData(loginData);
        this.router.navigate(['/journeys/discover']);
        this.http.get('http://localhost:8080/storage/'+ localStorage.getItem('username')).subscribe();
      },
        err => {
          this.toastr.errorToast((err.error.description ? err.error.description : 'Unknown error occured. Please try again'));
        });
    });
  }

  async logout() {
    this.dataService.removeLocalData();
    await this.router.navigate(['/']);
  }

}
