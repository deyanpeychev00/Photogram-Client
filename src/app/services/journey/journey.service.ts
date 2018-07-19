import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
import {ToastrService} from '../toastr/toastr.service';
import {Router} from '@angular/router';

@Injectable()
export class JourneyService {
  kinvey = this.data.getKinveyCredentials();

  constructor(private http: HttpClient, private data: DataService, private toastr: ToastrService, private router: Router) {
  }

  updateJourney(journey): Observable<any> {
    return this.http.put(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys/${journey._id}`, journey, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  uploadJourney(name, description, images) {
    this.toastr.toast('Обработване на снимките и създаване на пътешествието..');
    // Upload Journey to the Collection
    this.uploadJourneyToCollection(name, description).subscribe(journeyData => {
      // Iterate through all journey images
      for (let image of images) {
        // get journey data to use its ID
        let jData: any = journeyData;
        // Upload images to Kinvey
        this.uploadImageToKinveyCollections(image, jData._id).subscribe(dataImage => {
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

  uploadImageToKinveyCollections(image, journeyID): Observable<any> {
    return this.http.post(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/images`, {
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
    }, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
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

  uploadJourneyToCollection(name: any, description: any): Observable<any> {
    return this.http.post(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys`, {
      name,
      caption: description,
      author: localStorage.getItem('username'),
      authorID: localStorage.getItem('userId'),
      ratings: [0, 0, 0, 0, 0],
      totalReviewers: 0
    }, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getAllJourneys(skipJourneyCount, limitCount): Observable<any> {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys?sort={"_kmd.ect":-1}&limit=${limitCount}&skip=${skipJourneyCount}&_kmd,fields=name,caption,featuredImage,author`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getAllJourneysAdmin(): Observable<any> {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys?query={}&fields=_id,name,author,photos`, {
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

  getCurrentJourney(journeyID): Observable<any> {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys/${journeyID}?query={}&fields=_id,name,caption,ratings,totalReviewers,author`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getJourneyPhotos(journeyID) {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/images/?query={"journeyID":"${journeyID}"}`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getJourneyPhotosIDs(journeyID) {
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/images/?query={"journeyID":"${journeyID}"}&fields=_id`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  getJourneyFeaturedImage(journeyID){
    return this.http.get(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/images/?query={"journeyID":"${journeyID}"}&fields=fileName&limit=1`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  removePhotoFromDatabase(photoID) {
    this.http.delete(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/images/${photoID}`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    }).subscribe(data => {
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка при изтриването на снимка, моля опитайте отново'));
    });
  }

  deleteJourney(journeyID): Observable<any> {
    return this.http.delete(`${this.kinvey.host}/appdata/${this.kinvey.appKey}/journeys/${journeyID}`, {
      headers: new HttpHeaders()
        .set('Authorization', 'Kinvey ' + localStorage.getItem('authtoken'))
        .set('Content-Type', 'application/json')
    });
  }

  // Server requests
  getJourneyFeaturedImageFromServer(journeyID){
    return this.http.get('http://localhost:8080/journey/featured/' + journeyID);
  }

  getFeaturedImageFile(filename){
    return this.http.get('http://localhost:8080/images/get/single/' + filename, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getJourneyPhotosFromServer(journeyID){
    return this.http.get('http://localhost:8080/journey/images/' + journeyID);
  }
}
