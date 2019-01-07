import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd, NavigationStart} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {MapService} from '../../services/map/map.service';
import {EXIF} from 'exif-js';
import {ToastrService} from '../../services/toastr/toastr.service';
import {JourneyService} from '../../services/journey/journey.service';
import {DataService} from '../../services/data/data.service';

declare const $: any;

@Component({
  selector: 'app-create-journey', templateUrl: './create-journey.component.html', styleUrls: ['./create-journey.component.css']
})
export class CreateJourneyComponent implements OnInit {

  selectedPictures: Array<any> = [];
  selectedFiles: Array<any> = [];
  donePhotos = [];
  journeyName: string;
  journeyDescription: string;


  constructor(private auth: AuthService, private map: MapService, private toastrService: ToastrService,
              private journeyService: JourneyService, private dataService: DataService, private router: Router) {
  }

  ngOnInit() {
    if (!this.auth.pathAuthProtector()) {
      return;
    }
    this.auth.isBlocked().subscribe((res: any) => {
      if(res.data.blocked){
        this.toastrService.errorToast('Профилът ви е блокиран. Не можете да създавате пътешествия.');
        this.router.navigate(['journeys/discover']);
        return;
      }
    });
    this.selectedPictures = this.donePhotos = this.selectedFiles = [];
    this.map.setEmptyMap('uploadJourneyMap');
  }

  onPictureSelectorChange(ev) {
    $('.uploadedPhotosWrapper').css('display', 'block');
    this.map.emptyMarkers();
    this.selectedPictures = [];
    this.selectedFiles = [];
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
            size: file.size / 1024,
            make: file.exifdata.Make ? file.exifdata.Make.toUpperCase() : '',
            model: file.exifdata.Model ? file.exifdata.Model.toUpperCase() : '',
            dateTaken: file.exifdata.DateTimeOriginal,
            location: this.journeyService.extractFileLocation(file),
            resolution: this.journeyService.extractFileResolution(file),
            flash: file.exifdata.Flash,
            iso: file.exifdata.ISOSpeedRatings,
            focalLength: file.exifdata.FocalLength,
            hasExif: Object.keys(file.exifdata).length > 0,
            showSize: true,
            encoded: fileReader.result,
            fileName: '',
            displayType: 'create'
          };
          if (Object.keys(file.exifdata).length > 0) {
            this.selectedFiles.push({file, fileID: imgObj.localID, details: imgObj});
          }
          this.selectedPictures.push(imgObj);
        });
      };
      fileReader.onerror = (error) => {
        console.error(error);
        this.toastrService.toast('Възникна проблем при качването на снимка.');
      };
    }
    this.map.connectJourneyMarkers();
  }

  createJourney() {
    this.donePhotos = this.selectedPictures.filter(p => p.hasExif);
    const validateJourney = this.auth.validateCreateJourney(this.journeyName, this.journeyDescription, this.donePhotos);
    if (!validateJourney.isValid) {
      this.toastrService.errorToast(validateJourney.msg);
    } else {
      this.toastrService.toast('Създаване на пътешествието..');

      this.journeyService.createJourney(this.journeyName, this.journeyDescription, this.selectedFiles).subscribe((res: any) =>{
        if(res == null){
          this.toastrService.errorToast('Възникна грешка, моля опитайте по-късно.');
          return;
        }
        if(res.success){
          this.toastrService.successToast(res.msg);
          this.clearForm();
          return;
        }else{
          this.toastrService.errorToast(res.msg);
          return;
        }
      }, err => {this.toastrService.errorToast('Възникна грешка, моля опитайте по-късно.');});
    }

    // this.clearForm();
  }


  cancelCreateJourney() {
    window.history.back();
  }

  clearForm() {
    // this.selectedPictures = this.donePhotos = [];
    this.journeyName = this.journeyDescription = '';
    $('.uploadFileInput').val('');
    $('.uploadedPhotosWrapper').css('display', 'none');
    this.map.clearMap();
  }

}
