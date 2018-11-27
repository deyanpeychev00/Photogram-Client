import { Component, OnInit } from '@angular/core';
import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import {ServerService} from '../../services/server/server.service';
declare const $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css', './register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  username: string;
  password:string;
  repeatedPassword:string;
  firstName: string;
  lastName: string;
  avatarUploaded = false;
  avatar: any;

  constructor(private toastr: ToastrService, private auth: AuthService, private router: Router, private dataService: DataService, private sanitizer: DomSanitizer, private serverService: ServerService) { }

  ngOnInit() {
    this.auth.pathProtector();
  }

  submitRegister() {
    const message = this.auth.validateRegisterForm(this.username, this.email, this.password, this.repeatedPassword, this.firstName, this.lastName);
    if(!message.success){
      this.toastr.errorToast(message.error);
      return;
    }

    this.auth.register(this.avatarUploaded, this.avatar, this.username, this.email, this.password, this.firstName, this.lastName);
    return true;
  }

  onPictureSelectorChange(e){
    if(e.target.files.length === 0){
      this.hideAvatarPlaceholder();
      return;
    }
    let file = e.target.files[0];
    // Validate image size
    let validator = this.auth.validateAvatarSize(file.size);
    if(validator.isValid){
      // save avatar for upload
      this.avatar = file;

      const imageUrl = URL.createObjectURL(file);
      this.sanitizer.bypassSecurityTrustStyle(imageUrl);
      this.displayAvatarPlaceholder(imageUrl);
    }else{
      this.hideAvatarPlaceholder();
      $('.avatar-upload-input').val('');
      this.toastr.errorToast(validator.msg);
    }
  }

  hideAvatarPlaceholder(){
    let image: any = document.getElementById('userAvatar');
    this.avatarUploaded = false;
    image.src = "";
    image.style.display = "none";
  }
  displayAvatarPlaceholder(imageUrl){
    let image: any = document.getElementById('userAvatar');
    this.avatarUploaded = true;
    image.src = imageUrl;
    image.style.display = 'inline-block';
  }
}
