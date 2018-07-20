import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
import {ToastrService} from '../toastr/toastr.service';
import {Router} from '@angular/router';

@Injectable()
export class JourneyService {
  serverURL = 'http://localhost:8080';

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {
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

  // GET
  getJourneyFeaturedImageFromServer(journeyID): Observable<any>{
    return this.http.get(`${this.serverURL}/journey/featured/${journeyID}`);
  }
  getFeaturedImageFile(filename): Observable<any>{
    return this.http.get(`${this.serverURL}/images/get/single/${filename}`, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  getJourneyPhotos(journeyID): Observable<any>{
    return this.http.get(`${this.serverURL}/journey/images/${journeyID}`);
  }
  getCurrentJourney(journeyID): Observable<any> {
    return this.http.get(`${this.serverURL}/journey/fields/${journeyID}`);
  }
  getAllJourneysAdmin(): Observable<any> {
    return this.http.get(`${this.serverURL}/journey/all/admin`);
  }
  getAllJourneys(skipJourneyCount, limitCount): Observable<any> {
    return this.http.get(`${this.serverURL}/journeys/${limitCount}/${skipJourneyCount}`);
  }
  getMyJourneys(author, skipJourneyCount, limitCount): Observable<any> {
    return this.http.get(`${this.serverURL}/journeys/mine/${author}/${limitCount}/${skipJourneyCount}`);
  }
  getJourneysByAuthorName(authorName, skipJourneyCount, limitCount): Observable<any> {
    return this.http.get(`${this.serverURL}/journeys/user/${authorName}/${limitCount}/${skipJourneyCount}`);
  }
  getUserJourneys(authorName): Observable<any> {
    return this.http.get(`${this.serverURL}/journeys/user/all/${authorName}`);
  }
  getJourneysInDateFrame(from, to): Observable<any> {
    return this.http.get(`${this.serverURL}/journeys/timeframe/${from}/${to}`);
  }
  // POST
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
  // UPDATE
  updateJourney(journey): Observable<any> {
    return this.http.put(`${this.serverURL}/journey/update/${journey._id}`, journey);
  }
  // DELETE
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


// additional function for getting IDs of journey photos - needed for testing purposes

// getJourneyPhotosIDs(journeyID) {
//     return this.http.get(`${this.serverURL}/images/ids/${journeyID}`);
//   }

}
