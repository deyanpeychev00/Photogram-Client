import { Component, OnInit, Input } from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';

@Component({
  selector: 'app-my-journey-preview',
  templateUrl: './my-journey-preview.component.html',
  styleUrls: ['./my-journey-preview.component.css']
})
export class MyJourneyPreviewComponent implements OnInit {
  @Input() journey;
  @Input() journeyCount;
  featuredImage;
  constructor(private journeyService: JourneyService) { }

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
