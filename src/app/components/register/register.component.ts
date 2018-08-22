import { Component, OnInit } from '@angular/core';
import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data/data.service';
import { DomSanitizer } from '@angular/platform-browser';


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

  constructor(private toastr: ToastrService, private auth: AuthService, private router: Router, private dataService: DataService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.auth.pathProtector();
  }

  submitRegister() {
    const message = this.auth.validateRegisterForm(this.username, this.email, this.password, this.repeatedPassword, this.firstName, this.lastName);
    if(!message.success){
      this.toastr.errorToast(message.error);
      return;
    }
    this.toastr.toast('Регистриране..');
    this.auth.register(this.username, this.email, this.password, this.firstName, this.lastName);
  }

  onPictureSelectorChange(e){
    this.avatarUploaded = true;
    let image: any = document.getElementById('userAvatar');
    if(e.target.files.length === 0){
      this.avatarUploaded = false;
      image.src = "";
      image.style.display = "none";
      return;
    }
    let file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    this.sanitizer.bypassSecurityTrustStyle(imageUrl);
    image.src = imageUrl;
    image.style.display = 'inline-block';
  }
}
