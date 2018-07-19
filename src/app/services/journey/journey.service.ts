import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
import {ToastrService} from '../toastr/toastr.service';
import {Router} from '@angular/router';

@Injectable()
export class JourneyService {
  kinvey = this.data.getKinveyCredentials();
  serverURL = 'http://localhost:8080';

  constructor(private http: HttpClient, private data: DataService, private toastr: ToastrService, private router: Router) {
  }
  // Service functions
  uploadJourney(name, description, images) {
    this.toastr.toast('Обработване на снимките и създаване на пътешествието..');
    // Upload Journey to the Collection
    this.uploadJourneyToCollection(name, description).subscribe(journeyData => {
      // Iterate through all journey images
      for (let image of images) {
        // get journey data to use its ID
        let jData: any = journeyData;
        // Upload images to Kinvey
        this.uploadImageToKinveyCollections(image, jData.data._id).subscribe(dataImage => {
        }, err => {
          this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
          return;
        });
      }
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
      return;
    });
    this.toastr.successToast(`Успешно създадохте пътешествието "${name}".`);
  }
  extractFileLocation(pht): Array<Number>{
    if (pht.exifdata && (pht.exifdata.GPSLatitude || pht.exifdata.GPSLongitude)) {
      const gpsLat = pht.exifdata.GPSLatitude;
      const dLatitude = (gpsLat[0] + gpsLat[1] / 60.0 + gpsLat[2] / 3600.0).toFixed(5);
      const gpsLon = pht.exifdata.GPSLongitude;
      const dLongitude = (gpsLon[0] + gpsLon[1] / 60.0 + gpsLon[2] / 3600.0).toFixed(5);
      return [dLatitude,dLongitude];
    }
    return [];
  }


  // REST API requests
  getAllJourneys(skipJourneyCount, limitCount): Observable<any> {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys?sort={"_kmd.ect":-1}&limit=${limitCount}&skip=${skipJourneyCount}&_kmd,fields=name,caption,featuredImage,author`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getMyJourneys(author, skipJourneyCount, limitCount): Observable<any> {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys?query={"author":"${author}"}&sort={"_kmd.ect":-1}&limit=${limitCount}&skip=${skipJourneyCount}&fields=_kmd,name,caption,featuredImage,author`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getUserJourneys(UID): Observable<any> {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys?query={"authorID":"${UID}"}&sort={"_kmd.ect":-1}&fields=_kmd,name,caption,featuredImage,author`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getJourneysByAuthorName(authorName, skipJourneyCount, limitCount): Observable<any> {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys/?query={"author":{"$regex":"^${authorName}"}}&sort={"_kmd.ect":-1}&limit=${limitCount}&skip=${skipJourneyCount}&fields=_kmd,name,caption,featuredImage,author`, {
      headers: new HttpHeaders().set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getJourneysInDateFrame(from, to): Observable<any> {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys/?query={"_kmd.ect":{"$gte":"${from}","$lte":"${to}"}}&sort={"_kmd.ect":-1}`, {
      headers: new HttpHeaders().set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  // Server requests
  getJourneyFeaturedImageFromServer(journeyID){
    return this.http.get(`${this.serverURL}/journey/featured/${journeyID}`);
  }

  getFeaturedImageFile(filename){
    return this.http.get(`${this.serverURL}/images/get/single/${filename}`, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getJourneyPhotos(journeyID){
    return this.http.get(`${this.serverURL}/journey/images/${journeyID}`);
  }

  updateJourney(journey): Observable<any> {
    return this.http.put(`${this.serverURL}/journey/update/${journey._id}`, journey);
  }

  getJourneyPhotosIDs(journeyID) {
    return this.http.get(`${this.serverURL}/images/ids/${journeyID}`);
  }

  uploadImageToKinveyCollections(image, journeyID): Observable<any> {
    return this.http.post(`${this.serverURL}/images/kinvey/upload`, {
      make: image.make,
      model: image.model,
      dateTaken: image.dateTaken,
      location: image.location,
      resolution: image.resolution,
      flash: image.flash,
      iso: image.iso,
      focalLength: image.focalLength,
      journeyID: journeyID,
      fileName: image.fileName,
      size: image.size
    });
  }

  uploadJourneyToCollection(name: any, description: any): Observable<any> {
    return this.http.post(`${this.serverURL}/journey/upload`, {
      name,
      caption: description,
      author: localStorage.getItem('username'),
      authorID: localStorage.getItem('userId'),
      ratings: [0, 0, 0, 0, 0],
      totalReviewers: 0
    });
  }

  getCurrentJourney(journeyID): Observable<any> {
    return this.http.get(`${this.serverURL}/journey/fields/${journeyID}`);
  }

  getAllJourneysAdmin(): Observable<any> {
    return this.http.get(`${this.serverURL}/journey/all/admin`);
  }

  deleteImageFromServer(img): Observable<any> {
    return this.http.post(`${this.serverURL}/images/delete`, img);
  }

  removePhotoFromDatabase(photoID) {
    this.http.delete(`${this.serverURL}/images/kinvey/delete/${photoID}`).subscribe(data => {
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка при изтриването на снимка, моля опитайте отново'));
    });
  }

  deleteJourney(journeyID): Observable<any> {
    return this.http.delete(`${this.serverURL}/journeys/delete/${journeyID}`);
  }

}
