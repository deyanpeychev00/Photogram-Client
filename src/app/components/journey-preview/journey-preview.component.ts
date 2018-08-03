import {Component, OnInit, Input} from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';

@Component({
  selector: 'app-journey-preview', templateUrl: './journey-preview.component.html', styleUrls: ['./journey-preview.component.css']
})
export class JourneyPreviewComponent implements OnInit {
  @Input() journey;
  @Input() journeyCount;
  featuredImage;
  imageLoaded = false;
  hasFeaturedImage = true;

  constructor(private journeyService: JourneyService) {
  }

  ngOnInit() {
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
}

