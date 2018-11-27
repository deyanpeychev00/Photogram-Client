import { Component, OnInit, Input } from '@angular/core';
import {MapService} from '../../services/map/map.service';
import {JourneyService} from '../../services/journey/journey.service';
import { DomSanitizer } from '@angular/platform-browser';
import {DataService} from '../../services/data/data.service';

declare const $:any;
@Component({
  selector: 'app-journey-image',
  templateUrl: './journey-image.component.html',
  styleUrls: ['./journey-image.component.css']
})
export class JourneyImageComponent implements OnInit {
  @Input() photo;
  photoModal:any;
  modalImg:any;
  angle = 0;
  imagePath: string;
  constructor(private mapService: MapService, private journeyService: JourneyService, private sanitizer: DomSanitizer, private dataService: DataService) { }

  ngOnInit() {
    this.imagePath = this.dataService.getAPI().uploads + this.photo.fileName;
    this.photo.location = this.photo.location.filter(l => l !== 0);
    this.photo.resolution = this.photo.resolution.filter(r => r !== 0);
    this.mapService.showRetrievedImage(this.photo, this.imagePath);
  }

// Get the image and insert it inside the modal - use its "alt" text as a caption

  showImageModal(){
    this.photoModal = document.getElementById(this.photo.id);
    this.modalImg = document.getElementById("img-"+this.photo.id);
    this.photoModal.style.display = "block";
  }


// When the user clicks on <span> (x), close the modal
  closeImageModal() {
    this.photoModal = document.getElementsByClassName("photoModal");
    for(let modal of this.photoModal){
        modal.style.display = "none";
    }

  }

  rotateImageRight(id){
    this.angle += 90;
    $(`#${id}`).css({
      '-webkit-transform': 'rotate(' + this.angle + 'deg)',
      '-moz-transform': 'rotate(' + this.angle + 'deg)',
      '-o-transform': 'rotate(' + this.angle + 'deg)',
      '-ms-transform': 'rotate(' + this.angle + 'deg)',
      'transform': 'rotate(' + this.angle + 'deg)'
    });
  }

  rotateImageLeft(id){
    this.angle -= 90;
    $(`#${id}`).css({
      '-webkit-transform': 'rotate(' + this.angle + 'deg)',
      '-moz-transform': 'rotate(' + this.angle + 'deg)',
      '-o-transform': 'rotate(' + this.angle + 'deg)',
      '-ms-transform': 'rotate(' + this.angle + 'deg)',
      'transform': 'rotate(' + this.angle + 'deg)'
    });

  }

}
