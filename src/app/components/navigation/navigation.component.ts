import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd, NavigationStart} from '@angular/router';
import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';
import {DataService} from '../../services/data/data.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  logged = localStorage.getItem('logged');
  username = localStorage.getItem('username');
  admin = this.auth.isAdmin();
  blocked: any;

  constructor(private router: Router, private toastr: ToastrService, private auth: AuthService, private dataService: DataService) {
    if(this.logged){
      router.events.subscribe((val) => {
        this.logged = localStorage.getItem('logged');
        this.username = localStorage.getItem('username');
        this.admin = this.auth.isAdmin();
        if(this.logged){
          this.auth.isBlocked().subscribe((res: any) => {
            this.blocked = res.data.blocked;
          });
        }

      });
    }
  }

  ngOnInit() {
    this.logged = localStorage.getItem('logged');
    this.username = localStorage.getItem('username');
    this.admin = this.auth.isAdmin();
    if(this.logged){
      this.auth.isBlocked().subscribe((res: any) => {
        this.blocked =  res.data.blocked;
      });
    }
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
