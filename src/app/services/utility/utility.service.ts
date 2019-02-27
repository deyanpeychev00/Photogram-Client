import {Injectable} from '@angular/core';
import {DataService} from '../data/data.service';

declare const $: any;

@Injectable()
export class UtilityService {

  constructor(private dataService: DataService) {
  }

  getServerUrl() {
    return {
      local: `http://localhost:8080`,
      remote: `${this.dataService.getDomainDetails().protocol}://${this.dataService.getDomainDetails().host}`
    };
  }

  getMapDetails() {
    return {
      authtoken: 'pk.eyJ1IjoiZGV5YW5wZXljaGV2IiwiYSI6ImNqaDk1ODE5dTAwd3gyenBpcXZ0MDRrZjUifQ.dWIGnZF0Hf9SymQJJcFjYw',
      layer: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token='
    };
  }

  getEmailVerificator() {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }

  showImageModal(id) {
    if (id !== '') {
      let photoModal = document.getElementById(id);
      photoModal.style.display = 'block';
    }
  }

  closeImageModal(className) {
    let photoModal: any = document.getElementsByClassName(className);
    for (let modal of photoModal) {
      modal.style.display = 'none';
    }
  }

  generateMarkerPopup(pht, type) {
    if (type === 'create') {
      return `
        <div>
            <img class="popup-image" src="${pht.thumbnail || pht.imgsrc}" style="max-width: 100%; z-index: 1;">
          <table class="responsive-table">
            <tbody style="font-size: 14px;">
              <tr>
                <td><b>Заснето на: </b></td>
                <td>${pht.timestamp}</td>
              </tr>
              <tr>
                <td><b>Координати: </b></td>
                <td>
                  <a href="http://www.google.com/maps/place/${pht.coordinates[0]},${pht.coordinates[1]}" target="_blank">
                    ${'X: ' + pht.coordinates[0] + ' / Y: ' + pht.coordinates[1]}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
         </div>`;
    }
    else if (type === 'details' || type === 'edit') {
      return $(`
        <div>
            <img class="hoverable popup-image" src="${pht.thumbnail || pht.imgsrc}" style="max-width: 100%; z-index: 1; cursor: pointer;">
          <table class="responsive-table">
            <tbody style="font-size: 14px;">
              <tr>
                <td><b>Заснето с: </b></td>
                <td>${pht.make} ${pht.model}</td>
              </tr>
              <tr>
                <td><b>Коментар: </b></td>
                <td>${pht.comment || 'Няма коментар'}</td>
              </tr>
            </tbody>
          </table>
         </div>`).click(() => {
        this.showImageModal(pht.id);
      })[0];
    }
    else if (type === 'locations') {
      return `<div>
          <a  href="/journeys/show/${pht.journeyId}">
            <img class="hoverable popup-image" src="${this.dataService.getAPI().uploads + pht.fileName}"  
            style="max-width: 100%; z-index: 1; cursor: pointer;">
          </a>
          <table class="responsive-table">
            <tbody style="font-size: 14px;">
              <tr>
                <td><b>Заснето с: </b></td>
                <td>${pht.make} ${pht.model}</td>
              </tr>
              <tr>
                <td><b>Коментар: </b></td>
                <td>${pht.comment || 'Няма коментар'}</td>
              </tr>
            </tbody>
          </table>
         </div>`;
    }
  }

  generateUploadedFileObject(file, res, encoded){
    return {
      position: 'TRANSIT',
      localID: btoa(file.name),
      size: file.size / 1024,
      location: res.data.location.length > 0 ? [res.data.location[0], res.data.location[1]] : [],
      hasExif: res.data.hasExif,
      showSize: true,
      encoded: encoded,
      fileName: '',
      displayType: 'create',
      dateTaken: res.data.dateTaken
    };
  }

  /*EXIF.getData(file, () => {
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
});*/

}
