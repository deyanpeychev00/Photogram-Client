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
  imagesLoaded = false;

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
      this.journey = res.data[0];
      this.journeyName = this.journey.name;
      this.journeyDescription = this.journey.caption;
      // get journey photos from db
      this.journeyService.getJourneyPhotos(this.journeyID).subscribe(picsData => {
        let pictures: any = picsData;
        this.imagesLoaded = true;
        // create image object for map rendering
        for (let pic of pictures.data) {
          let imgObj = {
            picName: pic.fileName,
            _id: pic._id,
            position: 'TRANSIT',
            localID: btoa(pic.fileName),
            size: pic.size,
            hasExif: true,
            showSize: false,
            location: pic.location,
            dateTaken: pic.dateTaken,
            fileName: pic.fileName,
            make: pic.make,
            model: pic.model,
            resolution: pic.resolution,
            flash: pic.flash,
            iso: pic.iso,
            focalLength: pic.focalLength,
            previouslyAdded: true
          };
          // push image object in markers array for map rendering and in pictures array for passing to child components
          this.journeyPictures.push(imgObj);
          this.imageMarkers.push({
            ID: imgObj.localID, coordinates: imgObj.location, timestamp: imgObj.dateTaken, thumbnail: ''
          });
        }
      }, picsErr => {
        this.toastr.errorToast((picsErr.error.description ? picsErr.error.description : 'Възникна грешка при зареждането на снимките, моля презаредете страницата.'));
      });
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
        ID: pic.localID, coordinates: pic.location || pic.coordinates, timestamp: pic.dateTaken, thumbnail: ''
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
            localID: btoa(file.name),
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
          this.selectedFiles.push({file, fileID: imgObj.localID});
          this.selectedPictures.push(imgObj);
          this.imageMarkers.push({
            ID: imgObj.localID, coordinates: imgObj.location, timestamp: imgObj.dateTaken, thumbnail: imgObj.encoded
          });
        });

      };
      fileReader.onerror = (error) => {
        console.log(error);
        this.toastrService.toast('Възникна проблем при качването на снимка.');
      };
    }

    // live connection of the markers
    this.map.connectEditMarkers(this.imageMarkers);
  }

  saveEdits() {
    // Fill the array for photos upload
    this.donePhotos = this.selectedPictures.filter(p => p.hasExif);
    for (let pic of this.journeyPictures) {
      this.donePhotos.push(pic);
    }
    // validate journey
    const validateJourney = this.auth.validateCreateJourney(this.journeyName, this.journeyDescription, this.donePhotos);
    if (!validateJourney.isValid) {
      this.toastrService.errorToast(validateJourney.msg);
      return;
    } else {
      this.toastr.toast('Запазване на промените...');

      //      upload new pictures
      let photosToAdd = this.donePhotos.filter(p => p.previouslyAdded !== true);

      if(photosToAdd.length > 0){
        // upload pictures to server and save their details in db
        if (this.uploadFiles(photosToAdd)) {
          // update journey details
          this.journey.name = this.journeyName;
          this.journey.caption = this.journeyDescription;
          // update journey itself
          this.journeyService.updateJourney(this.journey).subscribe(data => {
            console.log("OUTPUT:");
            console.log(data);
            this.toastr.successToast('Промените бяха успешно записани');
            $('.btnUpdate').addClass('disabled');
          }, err => {
            this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
          });
        }
      }else{
        // update journey details
        this.journey.name = this.journeyName;
        this.journey.caption = this.journeyDescription;
        // update journey itself
        this.journeyService.updateJourney(this.journey).subscribe(data => {
          console.log("OUTPUT:");
          console.log(data);
          this.toastr.successToast('Промените бяха успешно записани');
          $('.btnUpdate').addClass('disabled');
        }, err => {
          this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
        });
      }

    }
  }


  uploadFiles(dPht) {
    // process all files for upload
    for (let fileObj of this.selectedFiles) {
      // upload each file to server
      this.serverService.uploadFileToServer(fileObj.file).subscribe((result: any) => {
        // get filename from server response
        if (result.success) {
          // process the file upload result (server response)
          let photoForKinvey = this.processFileUploadResult(result.data.filename, fileObj, dPht);
          // upload image details to db
          this.journeyService.uploadImageToKinveyCollections(photoForKinvey, this.journeyID).subscribe(data=>{console.log(data);});
        } else if (!result.success) {
          this.toastrService.errorToast(result.msg ? result.msg : 'Възникна грешка, моля опитайте отново');
          return false;
        }
      });
    }
    return true;
  }

  processFileUploadResult(fileName, fileObj, dPht) {
    // update the filename of the images to upload with the one returned from server after image upload
    let photoObj;
    for (let i = 0; i < dPht.length; i++) {
      if (this.donePhotos[i].localID === fileObj.fileID) {
        this.donePhotos[i].fileName = fileName;
        photoObj = this.donePhotos[i];
        break;
      }
    }
    return photoObj;
  }

  cancelCreateJourney() {
    this.router.navigate(['/']);
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

    // delete journey pictures
    for (let pic of this.journeyPictures) {
      this.deleteImage(pic);
    }

    // delete journey itself
    this.journeyService.deleteJourney(this.journeyID).subscribe(data => {
      console.log("OUTPUT: ");
      console.log(data);
      this.toastr.successToast('Успешно изтрихте пътешествието');
      this.router.navigate(['/journeys/myjourneys']);
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });

  }

  deleteImage(e) {

    // Remove item from markers array
    for (let i = 0; i < this.imageMarkers.length; i++) {
      if (this.imageMarkers[i].ID === e.localID) {
        this.imageMarkers.splice(i, 1);
        break;
      }
    }
    // delete item from existing journey pictures array
    for (let i = 0; i < this.journeyPictures.length; i++) {
      if (this.journeyPictures[i].localID === e.localID) {
        this.journeyPictures.splice(i, 1);
        break;
      }
    }
    this.journeyService.deleteImageFromServer(e).subscribe((res:any) => {
      console.log("S OUTPUT: ");
      console.log(res);
      if(res.success){
        this.journeyService.removePhotoFromDatabase(e._id).subscribe((d: any) => {
          console.log("DB OUTPUT: ");
          console.log(d);
        });
      }else{
        this.toastr.errorToast(res.msg ? res.msg : "Възникна грешка, моля опитайте отново");
      }
    });
    // Update map
    this.map.emptyMarkers();
    this.map.connectEditMarkers(this.imageMarkers);

  }

}
