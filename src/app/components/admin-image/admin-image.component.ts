import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {MapService} from '../../services/map/map.service';
import { DomSanitizer } from '@angular/platform-browser';
declare const $:any;

@Component({
  selector: 'app-admin-image',
  templateUrl: './admin-image.component.html',
  styleUrls: ['./admin-image.component.css']
})
export class AdminImageComponent implements OnInit {
  @Input() photo;
  photoModal:any;
  imgContainer:any;
  modalImg:any;
  imgLocation: string;

  @Output() delete: EventEmitter<any> = new EventEmitter();
  constructor(private mapService: MapService, private journeyService: JourneyService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.journeyService.getFeaturedImageFile(this.photo.fileName).subscribe(file => {
      const imageUrl = URL.createObjectURL(file);
      this.sanitizer.bypassSecurityTrustStyle(imageUrl);
      let image: any = document.getElementById('img-clicker-' + this.photo._id);
      image.src = imageUrl;
      this.photo.picName = this.photo.fileName;
      this.photo.fileName = imageUrl;
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

  deleteImage(){
    this.closeImageModal();
    this.delete.emit(this.photo);
  }

// When the user clicks on <span> (x), close the modal
  closeImageModal() {
    this.photoModal = document.getElementsByClassName("photoModal");
    for(let modal of this.photoModal){
      modal.style.display = "none";
    }

  }

}
