import { Component, OnInit } from '@angular/core';
import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  username: string;
  password:string;
  repeatedPassword:string;
  firstName: string;
  lastName: string;

  constructor(private toastr: ToastrService, private auth: AuthService, private router: Router, private dataService: DataService) { }

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
}
