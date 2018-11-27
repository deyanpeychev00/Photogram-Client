import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {JourneyService} from '../../services/journey/journey.service';
import {ToastrService} from '../../services/toastr/toastr.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';

@Component({
  selector: 'app-journeys-discover',
  templateUrl: './journeys-discover.component.html',
  styleUrls: ['./journeys-discover.component.css']
})
export class JourneysDiscoverComponent implements OnInit {
  journeysArr = [];
  searchedAuthor: string;
  isListening = true;
  journeysCount = 0;
  upcommingResults = true;
  limitCount = 5;
  dateFrom;
  dateTo;
  flag: string;

  constructor(private auth: AuthService, private journeyService: JourneyService, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    if(!this.auth.pathAuthProtector()){
      return;
    }
    this.retreiveJourneys();
  }
  retreiveJourneys(){
    this.journeyService.getAllJourneys(this.journeysCount).subscribe((res:any) => {
      this.flag = "all";
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

  getJourneysByAuthorName(SA = this.searchedAuthor, retrieved = false){
    this.flag="user";
    this.searchedAuthor = SA;
    if(!retrieved){
      this.journeysArr = [];
      this.journeysCount = 0;
      this.upcommingResults = true;
    }

    this.journeyService.getUserJourneys(SA, this.journeysCount).subscribe((res: any) => {
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

  searchJourneysInDateFrame(ev, retrieved = false){
    this.flag = "date";
    [this.dateFrom, this.dateTo] = [ev[0],ev[1]];
    if(!retrieved){
      this.journeysArr = [];
      this.journeysCount = 0;
      this.upcommingResults = true;
    }
    this.journeyService.getJourneysInDateFrame(this.dateFrom, this.dateTo, this.journeysCount).subscribe((res: any) => {
        if(res.data.length < this.limitCount){
          this.upcommingResults = false;
        }

        for (let el of res.data){
          this.journeysArr.push(el);
          this.journeysCount++;
        }
    },
      err => {
        this.isListening = false;
        this.upcommingResults = false;
        console.log(err);
        this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
      });
  }

  loadMoreJourneys() {
    if(this.isListening && this.upcommingResults){
      if(this.flag === "all"){
        this.retreiveJourneys();
      }
      if(this.flag === "user"){
        this.getJourneysByAuthorName(this.searchedAuthor, true);
      }
      if(this.flag === "date"){
        this.searchJourneysInDateFrame([this.dateFrom, this.dateTo], true);
      }
    }
  }

  scrollToTop(){
    window.scrollTo(0,0);
  }
}
