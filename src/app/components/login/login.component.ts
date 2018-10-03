import { Component, OnInit } from '@angular/core';
import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string;
  password:string;

  constructor(private toastr: ToastrService, private auth: AuthService, private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.auth.pathProtector();
  }

  submitLogin() {
    this.auth.login(this.username, this.password);
  }
}
