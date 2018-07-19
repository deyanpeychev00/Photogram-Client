import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MapService} from '../../services/map/map.service';
import {JourneyService} from '../../services/journey/journey.service';
import { DomSanitizer } from '@angular/platform-browser';

declare const $: any;

@Component({
  selector: 'app-edit-picture-form',
  templateUrl: './edit-picture-form.component.html',
  styleUrls: ['./edit-picture-form.component.css']
})
export class EditPictureFormComponent implements OnInit {
  @Input() photo;
  @Output() delete: EventEmitter<any> = new EventEmitter();

  photoModal:any;
  imgContainer:any;
  modalImg:any;
  imgLocation: string;
  angle = 0;

  constructor(private mapService: MapService, private journeyService: JourneyService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.journeyService.getFeaturedImageFile(this.photo.fileName).subscribe(file => {
      const imageUrl = URL.createObjectURL(file);
      let image: any = document.getElementById('img-clicker-'+this.photo.localID);
      this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      image.src = imageUrl;
      this.photo.fileName = imageUrl;
      this.mapService.showRetrievedImage(this.photo);
    });
  }

  deleteImage(){
    this.closeImageModal();
    this.delete.emit(this.photo);
  }

  showImageModal(){
    this.closeImageModal();

    this.photoModal = document.getElementById(this.photo.localID);
    this.imgContainer = document.getElementById('img-clicker-'+this.photo.localID);
    this.modalImg = document.getElementById("img-"+this.photo.localID);

    this.photoModal.style.display = "block";
    let imageModal: any = this.modalImg;
    let imageContainer: any = this.imgContainer;
    imageModal.src = imageContainer.src;
  }

  closeImageModal() {
    this.photoModal = document.getElementsByClassName("photoModal");
    for(let modal of this.photoModal){
      modal.style.display = "none";
    }
  }
}
