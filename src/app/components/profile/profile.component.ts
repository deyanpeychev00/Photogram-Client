import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin/admin.service';
import {JourneyService} from '../../services/journey/journey.service';
import {AuthService} from '../../services/auth/auth.service';
import {ToastrService} from '../../services/toastr/toastr.service';
import {ServerService} from '../../services/server/server.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DataService} from '../../services/data/data.service';


@Component({
  selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string;
  email: string;
  role: string;
  name: string;
  journeysArr = [];
  userDetailsLoaded = false;
  userObj: any;
  newEmail = '';
  userAvatar = '';
  isListening = true;
  journeysCount = 0;
  upcommingResults = true;
  limitCount = 5;

  constructor(private dataService: DataService, private adminService: AdminService, private journeyService: JourneyService, private auth: AuthService, private toastr: ToastrService, private serverService: ServerService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.adminService.getUserByUsername(localStorage.getItem('username')).subscribe((res: any) => {
      console.log(res);
      this.userObj = res.data;
      this.userDetailsLoaded = true;
      this.name = this.userObj.firstName + ' ' + this.userObj.lastName;
      this.username = res.data.username;
      this.email = res.data.email;
      this.role = res.data.roles.length > 0 ? 'Админ' : 'Потребител';
      this.userAvatar = this.dataService.getAPI().avatars + res.data.avatar;
      this.retreiveUserJourneys();

    });
  }


  retreiveUserJourneys(){
    this.journeyService.getUserJourneys(this.username, this.journeysCount).subscribe((res: any) => {
      if(res.data.length < this.limitCount){
        this.upcommingResults = false;
      }

      for (let el of res.data){
        this.journeysArr.push(el);
        this.journeysCount++;
      }
    }, err => {
      this.isListening = false;
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });

  }

  loadMoreJourneys() {
    if (this.isListening && !this.upcommingResults) {
      this.retreiveUserJourneys();
    }
  }

  closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  showModal(id) {
    document.getElementById(id).style.display = 'block';
    this.disableButton();
    window.onclick = (event) => {
      if (event.target === document.getElementById('emailModal')) {
        this.closeModal('emailModal');
      }
    };
  }

  enableButton() {
    let button: any = document.getElementById('updateEmailButton');
    button.disabled = false;
  }

  disableButton() {
    let button: any = document.getElementById('updateEmailButton');
    button.disabled = true;
  }

  onEmailChange(email) {
    this.newEmail = email;
    let validator = this.auth.validateEmail(this.newEmail);
    if (validator.success && this.newEmail !== this.email) {
      this.enableButton();
    } else {
      this.disableButton();
    }
  }

  updateUserEmail() {
    this.userObj.email = this.newEmail;
    this.adminService.updateUser(this.userObj).subscribe((successObj) => {
      console.log(successObj);
      this.email = this.newEmail;
      this.toastr.successToast('Промените бяха записани успешно');
      this.closeModal('emailModal');
    });
  }
}
