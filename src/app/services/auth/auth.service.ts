import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
import {Router} from '@angular/router';
import {ToastrService} from '../toastr/toastr.service';
import {AdminService} from '../admin/admin.service';
import {UtilityService} from '../utility/utility.service';

@Injectable()
export class AuthService {

  emailRegex: RegExp = this.util.getEmailVerificator();
  phpURL = this.util.getServerUrl().remote;

  constructor(private http: HttpClient, private dataService: DataService, private router: Router, private toastr: ToastrService, private admin: AdminService, private util: UtilityService) {}

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
    return this.blockProtector();
  }

  blockProtector() {
    return this.http.get(`${this.phpURL}/api/users/single.php`, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
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

  validateEmail(email){
    if (!this.emailRegex.test(email) || email === '' || email === null || email === undefined) {
      return {
        success: false, error: 'Невалиден имейл.'
      };
    }
    return {
      success: true, error: ''
    };
  }
  validateRegisterForm(username, email, password, repeatedPassword, firstName, lastName) {
    // check username
    if(username.indexOf('/') !== -1 || username.indexOf('\\') !== -1){
      return {success: false, error: 'Невалидно потребителско име.'};
    }
    if (username === '' || username === null || username === undefined || username.length < 6) {
      return {success: false, error: 'Потребителското име трябва да е минимум 6 символа.'};
    }
    // check email
    if (!this.emailRegex.test(email) || email === '' || email === null || email === undefined) {
      return {success: false, error: 'Невалиден имейл.'};
    }
    // check first name
    if (firstName === '' || firstName === null || firstName === undefined) {
      return {success: false, error: 'Моля въведете вашето име.'};
    }
    // check last name
    if (lastName === '' || lastName === null || lastName === undefined) {
      return {success: false, error: 'Моля въведете вашата фамилия.'};
    }
    // check password
    if (password === '' || password === null || password === undefined || password.length < 6) {
      return {success: false, error: 'Паролата трябва да е минимум 6 символа.'};
    }
    // check password matching
    if (password !== repeatedPassword) {
      return {success: false, error: 'Паролите не съвпадат.'};
    }
    return {success: true, error: ''};
  }
  validatePostPicture(file) {
    if (file.size > 10 * 1000000.0) {
      return {
        isValid: false, msg: 'Снимката трябва да е под 10MB.'
      };
    }
    return {
      isValid: true, msg: ''
    };
  }
  validateAvatarSize(size){
    if (size > 1 * 1000000.0) {
      return {
        isValid: false, msg: 'Снимката трябва да е под 1MB.'
      };
    }
    return {
      isValid: true, msg: ''
    };
  }
  validateCreateJourney(name, description, images) {
    if (name === undefined || name === null || name === '') {
      return {isValid: false, msg: 'Невалидно име.'};
    }
    if (description === undefined || description === null || description === '') {
      return {isValid: false, msg: 'Невалидно описание.'};
    }
    if (images === undefined || images === null || images.length <= 0) {
      return {isValid: false, msg: 'Моля качете вашите снимки.'};
    }

    for(let image of images){
      if (image.comment && image.comment.length > 60){
        return {isValid: false, msg: 'Коментарът към снимката не може да бъде повече от 60 символа.'};
      }
    }

    return {isValid: true, msg: ''};
  }

  register(hasAvatar, avatar, username, email, password, firstName, lastName){
    const body = {username, password, firstName, lastName, email, journeys: [], roles: [], blocked: false};

    let formData = new FormData();
    if(hasAvatar){
      formData.append('user_avatar', avatar);
    }
    formData.append('register_data', JSON.stringify(body));

    this.http.post(`${this.phpURL}/api/register.php`, formData, {}).subscribe((res: any) => {
      if(res === null){
        this.toastr.errorToast('Възникна грешка, моля опитайте по-късно.');
        return;
      }
      if(res.success){
        this.dataService.setUserLocalData(res.data);
        this.toastr.successToast(res.msg);
        this.router.navigate(['/journeys/discover']);
      }else{
        this.toastr.errorToast(res.msg);
      }
    }, err => {
      this.toastr.errorToast('Възникна грешка, моля опитайте по-късно.');
    });

  }
  login(username, password) {
    const body = {username, password};

    this.http.post(`${this.phpURL}/api/login.php`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).subscribe((res: any) => {
      if(res === null){
        this.toastr.errorToast('Възникна грешка, моля опитайте по-късно.');
        return;
      }
      if(res.success){
        this.dataService.setUserLocalData(res.data);
        this.toastr.successToast(res.msg);
        this.router.navigate(['/journeys/discover']);
      }else{
        this.toastr.errorToast(res.msg);
      }
    }, (err:any) => {this.toastr.errorToast('Възникна грешка, моля опитайте по-късно.');});
  }
  async logout() {
    this.dataService.removeLocalData();
    await this.router.navigate(['/']);
  }

}
