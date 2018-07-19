import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';
import {DataService} from '../../services/data/data.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  logged = this.auth.isLogged();
  username = localStorage.getItem('username');
  admin = this.auth.isAdmin();
  blocked = this.auth.isBlocked();

  constructor(private router: Router, private toastr: ToastrService, private auth: AuthService, private dataService: DataService) {
    router.events.subscribe((val) => {
      this.logged = this.auth.isLogged();
      this.username = localStorage.getItem('username');
      this.admin = this.auth.isAdmin();
      this.blocked = this.auth.isBlocked();
    });
  }

  ngOnInit() {
    this.logged = this.auth.isLogged();
    this.username = localStorage.getItem('username');
    this.admin = this.auth.isAdmin();
    this.blocked = this.auth.isBlocked();
  }

  openNav() {
    document.getElementById('leftSidenav').style.width = '250px';
  }

  closeNav() {
    document.getElementById('leftSidenav').style.width = '0';
  }

  logOut() {
    this.auth.logout();
  }
}
