import { Component, OnInit, Input } from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {DataService} from '../../services/data/data.service';

@Component({
  selector: 'app-my-journey-preview',
  templateUrl: './my-journey-preview.component.html',
  styleUrls: ['./my-journey-preview.component.css']
})
export class MyJourneyPreviewComponent implements OnInit {
  @Input() journey;
  @Input() journeyCount;
  featuredImageSrc;

  constructor(private journeyService: JourneyService, private dataService: DataService) { }

  ngOnInit() {
    this.featuredImageSrc = this.dataService.getAPI().uploads + this.journey.featuredImage;
  }

}
