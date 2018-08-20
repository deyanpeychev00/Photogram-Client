import { Component, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin/admin.service';
import {JourneyService} from '../../services/journey/journey.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string;
  email: string;
  role: string;
  name: string;
  journeysCount: number;
  journeysArr = [];
  userDetailsLoaded = false;


  constructor(private adminService: AdminService, private journeyService: JourneyService) { }

  ngOnInit() {
    this.adminService.getSingleUser(localStorage.getItem('userId')).subscribe((userData: any) => {
      let details = userData.data[0];
      this.username = '@' + details.username;
      this.email = details.email;
      this.role = details.roles.length !== 0 ? 'Админ' : 'Потребител';
      this.name = details.firstName + ' ' + details.lastName;
      this.journeyService.getUserJourneys(localStorage.getItem('username')).subscribe((journeysData: any) => {
        this.journeysCount = journeysData.data.length;
        this.userDetailsLoaded = true;
        this.journeysArr = journeysData.data;
      });
    });
  }


}
