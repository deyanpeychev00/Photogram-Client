import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd, NavigationStart} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {MapService} from '../../services/map/map.service';
import {EXIF} from 'exif-js';
import {ToastrService} from '../../services/toastr/toastr.service';
import {JourneyService} from '../../services/journey/journey.service';
import {DataService} from '../../services/data/data.service';
import {UtilityService} from '../../services/utility/utility.service';

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
  uploadingImagesProcess = false;
  uploadedImagesCount = 0;
  invalidImagesCount = 0;
  imagesForUpload = 0;
  uploadingJourneyProcess = false;
  uploadedImagesToServerCount = 0;


  constructor(private auth: AuthService, private map: MapService, private toastrService: ToastrService,
              private journeyService: JourneyService, private dataService: DataService, private router: Router, private util: UtilityService) {
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

  async onPictureSelectorChange(ev) {
    $('.uploadedPhotosWrapper').css('display', 'block');
    $('.determinate').css('width', '0');
    this.map.emptyMarkers();
    this.selectedPictures = [];
    this.selectedFiles = [];
    this.uploadedImagesCount = this.invalidImagesCount = 0;
    const files: Array<File> = ev.target.files;
    this.imagesForUpload = files.length;
    this.uploadingImagesProcess = files.length > 0;
    for (let i = 1; i <= files.length; i++) {
      const file: any = files[i-1];
      const validator = this.auth.validatePostPicture(file);
      if (!validator.isValid) {
        this.toastrService.errorToast(validator.msg);
        this.invalidImagesCount++;
      }else{
        const fileReader: FileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
          this.journeyService.validateImage(file).subscribe((res: any) => {
            if(res !== null && res.success){
              let imgObj = this.util.generateUploadedFileObject(file, res, fileReader.result);
              if (res.data.hasExif) {
                this.selectedFiles.push({file, fileID: imgObj.localID, details: imgObj});
              }
              this.selectedPictures.push(imgObj);
              this.uploadedImagesCount++;
              $('.determinate').css('width', `${(this.uploadedImagesCount*100)/(files.length-this.invalidImagesCount)}%`);
            }else if(!res.success){
              this.toastrService.errorToast('Възникна грешка, моля опитайте отново.');
              return;
            }
          });
        };
        fileReader.onerror = (error) => {
          console.error(error);
          this.toastrService.toast('Възникна проблем при качването на снимка.');
        };
      }
    }
    this.map.connectJourneyMarkers();
  }

  createJourney() {
    this.donePhotos = this.selectedPictures.filter(p => p.hasExif);
    const validateJourney = this.auth.validateCreateJourney(this.journeyName, this.journeyDescription, this.donePhotos);
    if (!validateJourney.isValid) {
      this.toastrService.errorToast(validateJourney.msg);
    } else {
      this.uploadingJourneyProcess = true;
      this.journeyService.createJourney(this.journeyName, this.journeyDescription/*, this.selectedFiles*/).subscribe((res: any) =>{
        if(res == null){
          this.toastrService.errorToast('Възникна грешка, моля опитайте по-късно.');
          return;
        }
        if(res.success){
          for(let fileObject of this.selectedFiles){
            this.journeyService.uploadImage(fileObject.file, fileObject.details.comment, res.data.journeyId).subscribe((imageRes: any) => {
              this.uploadedImagesToServerCount++;
              if(this.uploadedImagesToServerCount >= this.imagesForUpload){
                this.uploadingJourneyProcess = false;
                this.toastrService.successToast('Успешно създадохте пътешествието.');
                this.router.navigate(['/journeys/discover']);
              }
            });
          }
          // this.clearForm();
          return;
        }else{
          this.toastrService.errorToast(res.msg);
          return;
        }
      }, err => {this.toastrService.errorToast('Възникна грешка, моля опитайте по-късно.');});
    }
  }


  cancelCreateJourney() {
    window.history.back();
  }

  clearForm() {
    this.journeyName = this.journeyDescription = '';
    $('.uploadFileInput').val('');
    $('.uploadedPhotosWrapper').css('display', 'none');
    this.map.clearMap();
  }

}
