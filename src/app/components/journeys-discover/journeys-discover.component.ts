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
  searchedJourney: string;
  isListening = true;
  journeysCount = 0;
  upcommingResults = true;
  limitCount = 5;
  dateFrom;
  dateTo;

  constructor(private auth: AuthService, private journeyService: JourneyService, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    if(!this.auth.pathAuthProtector()){
      return;
    }
    this.retreiveJourneys();
  }
  retreiveJourneys(){
    // console.log("Journeys Count: " + this.journeysCount);
    this.journeyService.getAllJourneys(this.journeysCount, this.limitCount).subscribe((res:any) => {
      console.log("OUTPUT: ");
      console.log(res);

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

  getJourneysByAuthorName(SA = this.searchedJourney){
    this.journeysArr = [];
    this.journeysCount = 0;
    this.upcommingResults = true;

    this.journeyService.getJourneysByAuthorName(SA, this.journeysCount, this.limitCount).subscribe((res: any) => {
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

  searchJourneysInDateFrame(ev){
    [this.dateFrom, this.dateTo] = [ev[0],ev[1]];
    this.journeysArr = [];
    this.journeysCount = 0;
    this.upcommingResults = true;

    this.journeyService.getJourneysInDateFrame(this.dateFrom, this.dateTo).subscribe((res: any) => {
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
        this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
      });
  }

  loadMoreJourneys() {
    if(this.isListening){
      this.retreiveJourneys();
    }
  }

  scrollToTop(){
    window.scrollTo(0,0);
  }
}
