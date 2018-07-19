import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MapService} from '../../services/map/map.service';

declare const $: any;

@Component({
  selector: 'app-upload-picture-form',
  templateUrl: './upload-picture-form.component.html',
  styleUrls: ['./upload-picture-form.component.css']
})
export class UploadPictureFormComponent implements OnInit {
  @Input() photo;
  @Output() picChangeStatus = new EventEmitter<string>();
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.displayPictureOnMap(this.photo);
  }
  prepareForDelete(photoID){
    this.photo.prepareDelete = true;
    this.picChangeStatus.emit('updated');
  }

  cancelPrepareDelete(photoID){
    this.photo.prepareDelete = false;
    this.picChangeStatus.emit('updated');
  }
}
