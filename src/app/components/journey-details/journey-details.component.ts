import {Component, OnInit} from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ToastrService} from '../../services/toastr/toastr.service';
import {MapService} from '../../services/map/map.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-journey-details', templateUrl: './journey-details.component.html', styleUrls: ['./journey-details.component.css']
})
export class JourneyDetailsComponent implements OnInit {
  journey;
  journeyID;
  journeyPictures: Array<any> = [];
  journeyPicturesResponse = false;
  journeyLoaded = false;
  ratingsLoaded = false;
  userRating: string;
  journeyRating: Number;
  starsArr = new Array(5);

  constructor(private journeyService: JourneyService, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private map: MapService, private auth: AuthService) {
  }

  ngOnInit() {
    if(!this.auth.pathAuthProtector()){
      return;
    }
    this.map.initMap('journeyImagesMap');
    this.map.emptyMarkers();
    this.retreiveJourney();
  }

  retreiveJourney() {
    this.toastr.toast('Зареждане на детайлите за пътешествието..');
    this.activatedRoute.params.subscribe((params: Params) => {
      this.journeyID = params['id'];
    });
    this.journeyService.getCurrentJourney(this.journeyID).subscribe((res: any) => {
      if(res.success){
        this.journey = res.journey;
        this.journeyRating = this.calculateJourneyRating(this.journey);
        this.journeyPictures = res.images;
        this.journeyLoaded = this.ratingsLoaded = this.journeyPicturesResponse = true;
      }else{
        this.toastr.errorToast((res.msg ? res.msg : 'Възникна грешка, моля опитайте отново.'));
      }
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.'));
    });

  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  calculateJourneyRating(journey) {
    if (journey.totalReviewers === 0) {
      return 0;
    }

    let ratingsArr = journey.ratings;

    let rating = (5 * ratingsArr[4] + 4 * ratingsArr[3] + 3 * ratingsArr[2] + 2 * ratingsArr[1] + ratingsArr[0]) / (ratingsArr.reduce((a, b) => a + b, 0));
    return Math.round(rating);
  }

  postRating() {

    if(!this.userRating){
      this.toastr.errorToast("Моля изберете вашата оценка преди да гласувате");
      return;
    }
    this.closeModal();
    this.journey.ratings[Number(this.userRating) - 1]++;
    this.journey.totalReviewers++;
    this.journeyService.updateJourney(this.journey).subscribe((res:any) => {
      if(res === null || !res.success){
        this.toastr.errorToast(res.msg);
        return;
      }
      if(res.success){
        this.ratingsLoaded = true;
        this.calculateJourneyRating(this.journey);
        this.toastr.toast('Вашият глас беше отчетен');
      }
    }, err => this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.')));
  }

  showModal() {
    document.getElementById('myModal').style.display = 'block';
    window.onclick = (event) => {
      if (event.target === document.getElementById('myModal')) {
        this.closeModal();
      }
    };
  }

  closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }
}
