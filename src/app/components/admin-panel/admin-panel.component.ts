import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {AdminService} from '../../services/admin/admin.service';
import {ToastrService} from '../../services/toastr/toastr.service';
import {JourneyService} from '../../services/journey/journey.service';

@Component({
  selector: 'app-admin-panel', templateUrl: './admin-panel.component.html', styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private auth: AuthService, private admin: AdminService, private toastr: ToastrService, private journeyService: JourneyService) {
  }
  tab = '';


  ngOnInit() {
    if (!this.auth.pathAuthProtector()) {
      return;
    }
    if (!this.auth.pathAdminProtector()) {
      return;
    }
  }

  openTab(evt: any, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';

    this.tab = tabName;
    console.log(this.tab);
  }
}
