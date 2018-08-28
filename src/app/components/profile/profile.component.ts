import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin/admin.service';
import {JourneyService} from '../../services/journey/journey.service';
import {AuthService} from '../../services/auth/auth.service';
import {ToastrService} from '../../services/toastr/toastr.service';
import {ServerService} from '../../services/server/server.service';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-profile', templateUrl: './profile.component.html', styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string;
  email: string;
  role: string;
  name: string;
  journeysCount: number;
  journeysArr = [];
  userDetailsLoaded = false;
  userHasAvatar = false;
  userObj: any;
  newEmail = '';


  constructor(private adminService: AdminService, private journeyService: JourneyService, private auth: AuthService, private toastr: ToastrService, private serverService: ServerService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.adminService.getSingleUser(localStorage.getItem('userId')).subscribe((userData: any) => {
      let details = this.userObj = userData.data[0];

      this.username = '@' + details.username;
      this.email = details.email;
      this.role = details.roles.length !== 0 ? 'Админ' : 'Потребител';
      this.name = details.firstName + ' ' + details.lastName;
      this.journeyService.getUserJourneys(localStorage.getItem('username')).subscribe((journeysData: any) => {
        this.journeysCount = journeysData.data.length;
        if (details.avatar && details.avatar !== '') {
          this.displayAvatarPlaceholder(details.avatar);
        } else {
          this.userHasAvatar = false;
        }
        this.userDetailsLoaded = true;
        this.journeysArr = journeysData.data;
      });
    });
  }

  displayAvatarPlaceholder(avname) {
    this.userHasAvatar = true;
    this.serverService.getUserAvatar(avname).subscribe(file => {
      const imageUrl = URL.createObjectURL(file);
      let image: any = document.getElementById('userAvatarProfile');
      image.src = imageUrl;
      image.style.display = 'inline-block';
    });
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
    this.adminService.updateUser(this.userObj.UID, this.userObj).subscribe((successObj) => {
      console.log(successObj);
      this.email = this.newEmail;
      this.toastr.successToast('Промените бяха записани успешно');
      this.closeModal('emailModal');
    });
  }
}
