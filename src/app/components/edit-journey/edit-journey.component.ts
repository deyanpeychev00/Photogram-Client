import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {MapService} from '../../services/map/map.service';
import {EXIF} from 'exif-js';
import {ToastrService} from '../../services/toastr/toastr.service';
import {JourneyService} from '../../services/journey/journey.service';
import {DataService} from '../../services/data/data.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-edit-journey', templateUrl: './edit-journey.component.html', styleUrls: ['./edit-journey.component.css']
})
export class EditJourneyComponent implements OnInit {
  selectedPictures: Array<any> = [];
  donePhotos = [];
  journeyName = '';
  journeyDescription = '';
  journey;
  journeyID;
  journeyPictures = [];
  prevPicsAdded: boolean;

  constructor(private auth: AuthService, private map: MapService, private toastrService: ToastrService, private journeyService: JourneyService, private dataService: DataService, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private router: Router) {
  }

  ngOnInit() {
    this.auth.pathAuthProtector();
    this.map.setEmptyMap('uploadJourneyMap');
    this.map.clearMap();
    this.retreiveJourney();
  }

  retreiveJourney() {
    this.toastr.toast('Зареждане на детайлите за пътешествието..');
    this.activatedRoute.params.subscribe((params: Params) => {
      this.journeyID = params['id'];
    });
    this.journeyService.getCurrentJourney(this.journeyID).subscribe(data => {
      this.journey = data;
      this.journeyName = this.journey.name;
      this.journeyDescription = this.journey.caption;
      this.journeyService.getJourneyPhotos(this.journeyID).subscribe(picsData => {
        let pictures: any = picsData;

        for (let pic of pictures) {

          let imgObj = {
            _id: pic._id,
            position: 'TRANSIT',
            localID: btoa(pic.file.name),
            file: pic.file,
            encoded: pic.encoded,
            hasExif: Object.keys(pic.file.exifdata).length > 0,
            showSize: false,
            previouslyAdded: true
          };
          this.journeyPictures.push(imgObj);
          this.selectedPictures.push(imgObj);
        }

        this.prevPicsAdded = true;

      }, picsErr => {
        this.toastr.errorToast((picsErr.error.description ? picsErr.error.description : 'Възникна грешка при зареждането на снимките, моля презаредете страницата.'));
      });
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.'));
    });
  }

  onPictureSelectorChange(ev) {
    this.map.emptyMarkers();
    this.selectedPictures = [];
    this.prevPicsAdded = true;
    const files: Array<File> = ev.target.files;

    for (let i = 0; i < files.length; i++) {
      const file: any = files[i];
      const validator = this.auth.validatePostPicture(file);
      if (!validator.isValid) {
        this.toastrService.toast(validator.msg);
        continue;
      }
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        EXIF.getData(file, () => {
          let imgObj = {
            position: 'TRANSIT',
            localID: btoa(file.name),
            file: file,
            encoded: fileReader.result,
            hasExif: Object.keys(file.exifdata).length > 0,
            showSize: true
          };
          this.selectedPictures.push(imgObj);
        });
        if (this.prevPicsAdded) {
          for (let pic of this.journeyPictures) {
            pic.previouslyAdded = true;
            this.selectedPictures.push(pic);
          }
          this.prevPicsAdded = false;
        }
      };
      fileReader.onerror = (error) => {
        console.log(error);
        this.toastrService.toast('Възникна проблем при качването на снимка.');
      };
    }

    if (files.length === 0) {
      if (this.prevPicsAdded) {
        for (let pic of this.journeyPictures) {
          pic.previouslyAdded = true;
          this.selectedPictures.push(pic);
        }
        this.prevPicsAdded = false;
      }
    }

    this.map.connectJourneyMarkers();
  }

  saveEdits() {

    this.donePhotos = this.selectedPictures.filter(p => Object.keys(p.file.exifdata).length > 0);

    const validateJourney = this.auth.validateCreateJourney(this.journeyName, this.journeyDescription, this.donePhotos);
    if (!validateJourney.isValid) {
      this.toastrService.errorToast(validateJourney.msg);
      return;
    } else {
      this.toastr.toast('Запазване на промените...');

      // delete old pictures
      for (let i = 0; i < this.donePhotos.length; i++) {
        if (this.donePhotos[i].prepareDelete && this.donePhotos[i].prepareDelete === true) {

          this.journeyService.removePhotoFromDatabase(this.donePhotos[i]._id);

          // remove image from donePhotos after delete (avoid duplicates on adding images)
          this.donePhotos.splice(i, 1);
          i--;
        }
      }

      // upload new pictures
      let photosToAdd = this.donePhotos.filter(p => p.previouslyAdded !== true);

      for (let pht of photosToAdd) {
        this.journeyService.uploadImageToKinveyCollections(pht, this.journeyID).subscribe(data => {
        }, err => {
          this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка при качването на снимка, моля опитайте отново'));
        });
      }

      // update journey details
      this.journey.name = this.journeyName;
      this.journey.caption = this.journeyDescription;

      this.journeyService.updateJourney(this.journey).subscribe(data => {
        this.toastr.successToast('Промените бяха успешно записани');
        this.router.navigate(['/journeys/myjourneys']);
      }, err => {
        this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
      });
    }
  }

  cancelCreateJourney() {
    window.history.back();
  }

  clearForm() {
    this.selectedPictures = this.donePhotos = [];
    this.journeyName = this.journeyDescription = '';
    $('.uploadFileInput').val('');
    this.map.clearMap();
  }

  showMapChanges() {
    this.map.emptyMarkers();
    this.donePhotos = this.selectedPictures.filter(p => Object.keys(p.file.exifdata).length > 0);
    for (let pic of this.donePhotos) {
      if (!pic.prepareDelete) {
        this.map.displayPictureOnMap(pic);
      }
    }
  }

  showModal() {
    document.getElementById('myModal').style.display = 'block';
    window.onclick = (event) => {
      if (event.target === document.getElementById('myModal')) {
        this.closeModal();
      }
    };
  }

  closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }

  deleteJourney() {
    this.closeModal();
    this.toastr.toast('Изтриване на пътешествието..');

    // delete journey pictures
    for (let pic of this.journeyPictures) {
      this.journeyService.removePhotoFromDatabase(pic._id);
    }

    // delete journey itself
    this.journeyService.deleteJourney(this.journeyID).subscribe(data => {
          this.toastr.successToast('Успешно изтрихте пътешествието');
          this.router.navigate(['/journeys/myjourneys']);
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });

  }


}
