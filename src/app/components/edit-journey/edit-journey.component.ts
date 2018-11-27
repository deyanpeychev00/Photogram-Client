import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {MapService} from '../../services/map/map.service';
import {EXIF} from 'exif-js';
import {ToastrService} from '../../services/toastr/toastr.service';
import {JourneyService} from '../../services/journey/journey.service';
import {DataService} from '../../services/data/data.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ServerService} from '../../services/server/server.service';

declare const $: any;

@Component({
  selector: 'app-edit-journey', templateUrl: './edit-journey.component.html', styleUrls: ['./edit-journey.component.css']
})
export class EditJourneyComponent implements OnInit {
  selectedPictures: Array<any> = [];
  selectedFiles: Array<any> = [];
  donePhotos = [];
  journeyName = '';
  journeyDescription = '';
  journey;
  journeyID;
  journeyPictures = [];
  imageMarkers: Array<any> = [];

  constructor(private auth: AuthService, private map: MapService, private toastrService: ToastrService, private journeyService: JourneyService, private dataService: DataService, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private router: Router, private serverService: ServerService) {
  }

  ngOnInit() {
    this.auth.pathAuthProtector();
    this.map.setEmptyMap('uploadJourneyMap');
    this.map.clearMap();
    this.retreiveJourney();
  }

  retreiveJourney() {
    this.toastr.toast('Зареждане на детайлите за пътешествието..');
    // get journey ID from url params
    this.activatedRoute.params.subscribe((params: Params) => {
      this.journeyID = params['id'];
    });
    // get journey details from db
    this.journeyService.getCurrentJourney(this.journeyID).subscribe((res: any) => {
      this.journey = res.journey;
      this.journeyName = this.journey.name;
      this.journeyDescription = this.journey.description;
      for (let pic of res.images) {
        this.journeyPictures.push(pic);
        this.imageMarkers.push({
          ID: pic.id,
          coordinates: pic.location || pic.coordinates,
          timestamp: pic.dateTaken,
          thumbnail: this.dataService.getAPI().uploads + pic.fileName
        });
      }
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.'));
    });
  }

  onPictureSelectorChange(ev) {
    // empty markers and reset arrays
    this.map.emptyMarkers();
    let oldPics = this.journeyPictures;
    this.selectedFiles = [];
    this.selectedPictures = [];
    this.journeyPictures = [];
    this.imageMarkers = [];
    const files: Array<File> = ev.target.files;

    // push the existing journey image in markers and images arrays
    for (let pic of oldPics) {
      this.journeyPictures.push(pic);
      this.imageMarkers.push({
        ID: pic.id,
        coordinates: pic.location || pic.coordinates,
        timestamp: pic.dateTaken,
        thumbnail: this.dataService.getAPI().uploads + pic.fileName || ''
      });
    }
    // handle file input changes
    for (let i = 0; i < files.length; i++) {
      const file: any = files[i];
      // validate image size limits
      const validator = this.auth.validatePostPicture(file);
      if (!validator.isValid) {
        this.toastrService.toast(validator.msg);
        continue;
      }
      // read the file for future encoding
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        // extract file EXIF data
        EXIF.getData(file, () => {
          let imgObj = {
            position: 'TRANSIT',
            id: btoa(file.name),
            size: file.size / 1024,
            make: file.exifdata.Make ? file.exifdata.Make.toUpperCase() : '',
            model: file.exifdata.Model ? file.exifdata.Model.toUpperCase() : '',
            dateTaken: file.exifdata.DateTimeOriginal,
            location: this.journeyService.extractFileLocation(file),
            resolution: [file.exifdata.PixelXDimension, file.exifdata.PixelYDimension],
            flash: file.exifdata.Flash,
            iso: file.exifdata.ISOSpeedRatings,
            focalLength: file.exifdata.FocalLength,
            hasExif: Object.keys(file.exifdata).length > 0,
            showSize: true,
            encoded: fileReader.result,
            fileName: ''
          };
          // push file object to array of selected files for upload and to markers array for live update of the journey
          this.selectedFiles.push({file, fileID: imgObj.id, details: imgObj});
          this.selectedPictures.push(imgObj);
          this.imageMarkers.push({
            ID: imgObj.id, coordinates: imgObj.location, timestamp: imgObj.dateTaken, thumbnail: imgObj.encoded
          });
        });

      };
      fileReader.onerror = (error) => {
        this.toastrService.toast('Възникна проблем при качването на снимка.');
      };
    }

    // live connection of the markers
    this.map.connectEditMarkers(this.imageMarkers);
  }

  saveEdits() {
    // Fill the array for photos upload
    this.donePhotos = this.selectedPictures.filter(p => p.hasExif); // old + new images (required for journey validation)
    for (let pic of this.journeyPictures) {
      this.donePhotos.push(pic);
    }

    let photosForUpload = this.selectedFiles.filter(f => f.details.hasExif); // new files (images) to be uploaded
    let photosForUpdate = this.donePhotos.filter(p => p.forUpdate);
    // validate journey
    const validateJourney = this.auth.validateCreateJourney(this.journeyName, this.journeyDescription, this.donePhotos); // validate journey data and images
    if (!validateJourney.isValid) {
      this.toastrService.errorToast(validateJourney.msg);
      return;
    } else {
      // show user message
      this.toastr.toast('Запазване на промените...');
      // update journey details
      this.journey.name = this.journeyName;
      this.journey.description = this.journeyDescription;
      // update journey details
      this.journeyService.updateJourney(this.journey, photosForUpload, photosForUpdate).subscribe((res: any) => {
        if (res === null || !res.success) {
          this.toastr.errorToast(res.msg || 'Възникна грешка, моля опитайте по-късно.');
          return;
        }
        if (res.success) {
          this.toastr.successToast(res.msg);
          this.router.navigate(['journeys/myjourneys']);
        }
      }, err => {
        this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.'));
      });
    }
  }

  cancelEditJourney() {
    this.router.navigate(['journeys/myjourneys']);
  }

  clearForm() {
    // clear all inputs and map
    this.selectedPictures = this.donePhotos = [];
    this.journeyName = this.journeyDescription = '';
    $('.uploadFileInput').val('');
    this.map.clearMap();
  }

  showModal() {
    // show modal for journey delete confirmation
    document.getElementById('myModal').style.display = 'block';
    window.onclick = (event) => {
      if (event.target === document.getElementById('myModal')) {
        this.closeModal();
      }
    };
  }

  closeModal() {
    // close modal for journey delete confirmation
    document.getElementById('myModal').style.display = 'none';
  }

  deleteJourney() {
    this.closeModal();
    this.toastr.toast('Изтриване на пътешествието..');

    this.journeyService.deleteJourney(this.journeyID).subscribe((res: any) => {
      if (res === null || !res.success) {
        this.toastr.errorToast(res.msg || 'Възникна грешка, моля опитайте по-късно.');
        return;
      }
      if (res.success) {
        this.toastr.successToast(res.msg);
        this.router.navigate(['journeys/myjourneys']);
      }
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.'));
    });
  }

  deleteImage(e) {
    this.toastr.toast('Изтриване на снимката..');
    this.journeyService.deleteImage(e.id).subscribe((res: any) => {
      if (res === null) {
        this.toastr.errorToast('Възникна проблем, моля опитайте по-късно.');
      }
      if (res.success) {
        // Remove item from markers array
        for (let i = 0; i < this.imageMarkers.length; i++) {
          if (this.imageMarkers[i].ID === e.id) {
            this.imageMarkers.splice(i, 1);
            break;
          }
        }
        // delete item from existing journey pictures array
        for (let i = 0; i < this.journeyPictures.length; i++) {
          if (this.journeyPictures[i].id === e.id) {
            this.journeyPictures.splice(i, 1);
            break;
          }
        }
        this.toastr.successToast(res.msg);
        // Update map
        this.map.emptyMarkers();
        this.map.connectEditMarkers(this.imageMarkers);
      } else {
        this.toastr.errorToast(res.msg);
      }
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.'));
    });
  }
}
