import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AdminService} from '../../services/admin/admin.service';
import {DataService} from '../../services/data/data.service';
import {JourneyService} from '../../services/journey/journey.service';
import {ToastrService} from '../../services/toastr/toastr.service';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css', './../profile/profile.component.css']
})
export class UserPageComponent implements OnInit {

  userObj;
  userDetailsLoaded = false;
  journeysCount = 0;
  limitCount = 5;
  upcommingResults = true;
  isListening = true;
  journeysArr = [];
  constructor(private toastr: ToastrService, private journeyService: JourneyService, private dataService: DataService,private adminService: AdminService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      // check if user opens his own profile page and redirect him
      if(params['username'] === localStorage.getItem('username')){
        this.router.navigate(['/profile']);
        return;
      }
     this.retrieveUserData(params['username']);
    });
  }

  retrieveUserData(username){
    this.adminService.getUserByUsername(username).subscribe((res: any) => {
      if(res === null || res.success === false){
        this.toastr.errorToast(res.msg);
        this.router.navigate(['/journeys/discover']);
      }else if(res.success){
        console.log(res);
        this.userObj = res.data;
        this.userObj.name = res.data.firstName + ' ' + res.data.lastName;
        this.userObj.role = res.data.roles.length > 0 ? 'Админ' : 'Потребител';
        this.userObj.avatar = this.dataService.getAPI().avatars + res.data.avatar;
        this.userDetailsLoaded = true;
        this.retreiveUserJourneys(res.data.username);
      }

    });
  }


  retreiveUserJourneys(username = this.userObj.username){
    this.journeyService.getUserJourneys(username, this.journeysCount).subscribe((res: any) => {
      if(res.data.length < this.limitCount){
        this.upcommingResults = false;
      }

      for (let el of res.data){
        this.journeysArr.push(el);
        this.journeysCount++;
      }
    }, err => {
      this.isListening = false;
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });

  }


  loadMoreJourneys() {
    if (this.isListening && !this.upcommingResults) {
      this.retreiveUserJourneys();
    }
  }

}
