import {Component, OnInit, Input} from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {AdminService} from '../../services/admin/admin.service';
import {DataService} from '../../services/data/data.service';

@Component({
  selector: 'app-journey-preview', templateUrl: './journey-preview.component.html', styleUrls: ['./journey-preview.component.css']
})
export class JourneyPreviewComponent implements OnInit {
  @Input() journey;
  @Input() journeyCount;
  authorAvatarSrc;
  featuredImageSrc;
  starsArr = new Array(5);
  constructor(private journeyService: JourneyService, private adminService: AdminService, private dataService: DataService) {
  }

  ngOnInit(){
    this.journey.averageRating = this.calculateJourneyRating(this.journey);
    this.journey.dateCreated = this.journey.dateCreated.substr(0, 10);
    this.featuredImageSrc = this.dataService.getAPI().uploads + this.journey.featuredImage + '_m.jpg';
    this.authorAvatarSrc = this.dataService.getAPI().avatars + this.journey.avatar;
  }

  calculateJourneyRating(journey) {
    if (journey.totalReviewers === 0) {
      return 0;
    }

    let ratingsArr = journey.ratings;

    let rating = (5 * ratingsArr[4] + 4 * ratingsArr[3] + 3 * ratingsArr[2] + 2 * ratingsArr[1] + ratingsArr[0]) / (ratingsArr.reduce((a, b) => a + b, 0));
    return Math.round(rating);
  }

}

