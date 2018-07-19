import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  logged = this.auth.isLogged();

  constructor(private router: Router, private toastr: ToastrService, private auth: AuthService) {}

  ngOnInit() {
    if(this.logged){
      this.router.navigate(['/journeys/discover']);
    }
  }

  onLinkClick(){
      document.getElementById('about-photogram').scrollIntoView();
  }

}
