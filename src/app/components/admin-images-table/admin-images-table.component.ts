import {Component, OnInit, Input} from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {ToastrService} from '../../services/toastr/toastr.service';

@Component({
  selector: 'app-admin-images-table',
  templateUrl: './admin-images-table.component.html',
  styleUrls: ['./admin-images-table.component.css', './../admin-panel/admin-panel.component.css']
})
export class AdminImagesTableComponent implements OnInit {

  images = [];
  imagesLoaded = false;
  isListeningForImages = true;
  upcommingImages = true;
  imagesLimitCount = 14;

  constructor(private journeyService: JourneyService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllImages();
  }

  getAllImages(retrieved = false) {
    if (!retrieved) {
      this.images = [];
      this.upcommingImages = true;
      this.imagesLoaded = false;
    }

    this.journeyService.getAllImages(this.images.length).subscribe((res: any) => {

      if (res.data.length < this.imagesLimitCount) {
        this.isListeningForImages = false;
        this.upcommingImages = false;
      }
      for (let el of res.data) {
        this.images.push(el);
      }
      console.log(this.images.length);

      this.imagesLoaded = true;

    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });
  }

  loadMoreImages() {
    if (this.isListeningForImages && this.upcommingImages) {
      this.getAllImages(true);
    }
  }

  deleteImage(id) {
    this.journeyService.deleteImage(id).subscribe((res: any) => {
      if (res === null || !res.success) {
        this.toastr.errorToast(res.msg || 'Възникна грешка, моля опитайте по-късно.');
        return;
      }
      if (res.success) {
        let searchedImage = this.images.find(i => i.id === id);
        let searchedImageIndex = this.images.indexOf(searchedImage);
        this.images.splice(searchedImageIndex, 1);
        this.toastr.successToast(res.msg);
      }
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });
  }
}
