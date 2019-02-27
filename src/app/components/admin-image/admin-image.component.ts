import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {MapService} from '../../services/map/map.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DataService} from '../../services/data/data.service';
import {UtilityService} from '../../services/utility/utility.service';

declare const $: any;

@Component({
  selector: 'app-admin-image', templateUrl: './admin-image.component.html', styleUrls: ['./admin-image.component.css']
})
export class AdminImageComponent implements OnInit {
  @Input() photo;
  imagePath: string;

  @Output() delete: EventEmitter<any> = new EventEmitter();

  constructor(private mapService: MapService, private journeyService: JourneyService, private sanitizer: DomSanitizer, private dataService: DataService,
              private util: UtilityService) {
  }

  ngOnInit() {
    this.imagePath = this.dataService.getAPI().uploads + this.photo.fileName + '_m.jpg';
    this.photo.location = this.photo.location.filter(l => l !== 0);
    this.photo.resolution = this.photo.resolution.filter(r => r !== 0);
  }

// Get the image and insert it inside the modal - use its "alt" text as a caption

  showImageModal() {
    this.util.closeImageModal('photoModal');
    this.util.showImageModal(this.photo.id);
    console.log(this.photo);
  }

  deleteImage() {
    this.util.closeImageModal('photoModal');
    this.delete.emit(this.photo.id);
  }

// When the user clicks on <span> (x), close the modal
  closeImageModal() {
    this.util.closeImageModal('photoModal');
  }

}
