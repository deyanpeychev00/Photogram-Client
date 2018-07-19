import { Component, OnInit, Input} from '@angular/core';
import {MapService} from '../../services/map/map.service';

declare const $: any;

@Component({
  selector: 'app-upload-picture-form',
  templateUrl: './upload-picture-form.component.html',
  styleUrls: ['./upload-picture-form.component.css']
})
export class UploadPictureFormComponent implements OnInit {
  @Input() photo;
  constructor(private mapService: MapService) { }

  ngOnInit() {
      this.mapService.showRetrievedImage(this.photo);
  }

}
