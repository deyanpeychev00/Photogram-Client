import { Component, OnInit, Input } from '@angular/core';
import {MapService} from '../../services/map/map.service';
import {JourneyService} from '../../services/journey/journey.service';
import { DomSanitizer } from '@angular/platform-browser';
import {DataService} from '../../services/data/data.service';
import {UtilityService} from '../../services/utility/utility.service';

declare const $:any;
@Component({
  selector: 'app-journey-image',
  templateUrl: './journey-image.component.html',
  styleUrls: ['./journey-image.component.css']
})
export class JourneyImageComponent implements OnInit {
  @Input() photo;

  imagePath: string;
  constructor(private mapService: MapService, private journeyService: JourneyService, private sanitizer: DomSanitizer, private dataService: DataService, private utility: UtilityService) { }

  ngOnInit() {
    this.imagePath = this.dataService.getAPI().uploads + this.photo.fileName;
    this.photo.location = this.photo.location.filter(l => l !== 0);
    this.photo.resolution = this.photo.resolution.filter(r => r !== 0);
    this.photo.displayType = 'details';
    this.mapService.showRetrievedImage(this.photo, this.imagePath);
  }

// Get the image and insert it inside the modal - use its "alt" text as a caption
  showImageModal() {
    this.utility.showImageModal(this.photo.id);
  }

// When the user clicks on <span> (x), close the modal
  closeImageModal(className) {
    this.utility.closeImageModal(className);
  }

}
