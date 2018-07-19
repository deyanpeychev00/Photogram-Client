import {Component, OnInit, Input} from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';

@Component({
  selector: 'app-journey-preview', templateUrl: './journey-preview.component.html', styleUrls: ['./journey-preview.component.css']
})
export class JourneyPreviewComponent implements OnInit {
  @Input() journey;
  @Input() journeyCount;
  featuredImage;

  constructor(private journeyService: JourneyService) {
  }

  ngOnInit() {
    this.journeyService.getJourneyFeaturedImageFromServer(this.journey._id).subscribe((object: any) => {
      this.journeyService.getFeaturedImageFile(object.data[0].fileName).subscribe((file: any) => {
        const imageUrl = URL.createObjectURL(file);
        let image: any = document.getElementById(this.journey._id);
        image.src = imageUrl;
      });
    });
  }
}

