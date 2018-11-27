import {Component, OnInit, Input} from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {ServerService} from '../../services/server/server.service';
import {AdminService} from '../../services/admin/admin.service';
import {DataService} from '../../services/data/data.service';

@Component({
  selector: 'app-journey-preview', templateUrl: './journey-preview.component.html', styleUrls: ['./journey-preview.component.css']
})
export class JourneyPreviewComponent implements OnInit {
  @Input() journey;
  @Input() journeyCount;
  authorAvatarSrc;
  featuredImageSrc;

  constructor(private journeyService: JourneyService, private serverService: ServerService, private adminService: AdminService, private dataService: DataService) {
  }

  ngOnInit(){
    this.featuredImageSrc = this.dataService.getAPI().uploads + this.journey.featuredImage;
    this.authorAvatarSrc = this.dataService.getAPI().avatars + this.journey.avatar;
  }

}

