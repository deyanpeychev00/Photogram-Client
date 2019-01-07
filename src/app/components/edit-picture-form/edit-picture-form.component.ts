import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MapService} from '../../services/map/map.service';
import {JourneyService} from '../../services/journey/journey.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DataService} from '../../services/data/data.service';
import {UtilityService} from '../../services/utility/utility.service';

declare const $: any;

@Component({
  selector: 'app-edit-picture-form', templateUrl: './edit-picture-form.component.html', styleUrls: ['./edit-picture-form.component.css']
})
export class EditPictureFormComponent implements OnInit {
  @Input() photo;
  @Output() delete: EventEmitter<any> = new EventEmitter();

  imgLocation: string;
  oldComment: string;
  deleteModalID: string;

  constructor(private mapService: MapService, private journeyService: JourneyService, private sanitizer: DomSanitizer, private dataService: DataService,
              private util: UtilityService) {
  }

  ngOnInit() {
    this.oldComment = this.photo.comment || "";
    this.photo.forUpdate = false;
    this.imgLocation = this.dataService.getAPI().uploads + this.photo.fileName;
    this.photo.location = this.photo.location.filter(l => l !== 0);
    this.photo.resolution = this.photo.resolution.filter(r => r !== 0);
    this.deleteModalID = 'deleteModal-' + this.photo.id;
    this.mapService.showRetrievedImage(this.photo, this.imgLocation);
  }

  deleteImage() {
    this.closeModal('modal');
    this.delete.emit(this.photo);
  }

  showModal(modalID) {
      this.util.showImageModal(modalID);
  }

  closeModal(modalClass) {
    this.util.closeImageModal(modalClass);
  }

  updateImageComment(newComment){
    this.photo.comment = newComment;
    this.photo.forUpdate = this.oldComment !== newComment;
  }
}
