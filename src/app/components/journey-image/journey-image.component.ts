import { Component, OnInit, Input } from '@angular/core';
import {MapService} from '../../services/map/map.service';
import {JourneyService} from '../../services/journey/journey.service';
import { DomSanitizer } from '@angular/platform-browser';

declare const $:any;
@Component({
  selector: 'app-journey-image',
  templateUrl: './journey-image.component.html',
  styleUrls: ['./journey-image.component.css']
})
export class JourneyImageComponent implements OnInit {
  @Input() photo;
  photoModal:any;
  imgContainer:any;
  modalImg:any;
  imgLocation: string;
  angle = 0;
  constructor(private mapService: MapService, private journeyService: JourneyService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.journeyService.getFeaturedImageFile(this.photo.fileName).subscribe(file => {
      const imageUrl = URL.createObjectURL(file);
      this.sanitizer.bypassSecurityTrustStyle(imageUrl);
      let image: any = document.getElementById('img-clicker-' + this.photo._id);
      image.src = imageUrl;
      this.photo.fileName = imageUrl;
      this.mapService.showRetrievedImage(this.photo);
    });
  }

// Get the image and insert it inside the modal - use its "alt" text as a caption

  showImageModal(){
    this.closeImageModal();

    this.photoModal = document.getElementById(this.photo._id);
    this.imgContainer = document.getElementById('img-clicker-'+this.photo._id);
    this.modalImg = document.getElementById("img-"+this.photo._id);

    this.photoModal.style.display = "block";
    let imageModal: any = this.modalImg;
    let imageContainer: any = this.imgContainer;
    imageModal.src = imageContainer.src;
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
