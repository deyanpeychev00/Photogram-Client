import {Component, OnInit, Input} from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {ServerService} from '../../services/server/server.service';
import {AdminService} from '../../services/admin/admin.service';

@Component({
  selector: 'app-journey-preview', templateUrl: './journey-preview.component.html', styleUrls: ['./journey-preview.component.css']
})
export class JourneyPreviewComponent implements OnInit {
  @Input() journey;
  @Input() journeyCount;
  featuredImage;
  imageLoaded = false;
  hasFeaturedImage = true;
  userHasAvatar = true;

  constructor(private journeyService: JourneyService, private serverService: ServerService, private adminService: AdminService) {
  }

  ngOnInit() {
    this.adminService.getUserByUsername(this.journey.author).subscribe((u: any) => {
      let details = u.data[0];
      if (details.avatar && details.avatar !== '') {
        this.displayAvatarPlaceholder(details.avatar);
      } else {
        this.userHasAvatar = false;
      }
    });


    this.journeyService.getJourneyFeaturedImageFromServer(this.journey._id).subscribe((object: any) => {
      if(object.data.length === 0){
        this.hasFeaturedImage = false;
        this.imageLoaded = true;
        return;
      }
      // find journey feature image
      for(let obj of object.data){
        if(obj.fileName !== ""){
          this.journeyService.getFeaturedImageFile(obj.fileName).subscribe((file: any) => {
            const imageUrl = URL.createObjectURL(file);
            let image: any = document.getElementById(this.journey._id);
            image.src = imageUrl;
            this.imageLoaded = true;
          });
          break;
        }
      }
    });
  }

  displayAvatarPlaceholder(avname) {
    this.userHasAvatar = true;
    this.serverService.getUserAvatar(avname).subscribe(file => {
      const imageUrl = URL.createObjectURL(file);
      let image: any = document.getElementById('userAvatar-' + this.journey.author);
      image.src = imageUrl;
      image.style.display = 'inline-block';
    });
  }

}

