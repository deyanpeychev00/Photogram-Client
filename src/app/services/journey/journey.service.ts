import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataService} from '../data/data.service';
import {ToastrService} from '../toastr/toastr.service';
import {Router} from '@angular/router';
import {UtilityService} from '../utility/utility.service';

@Injectable()
export class JourneyService {
  serverURL = this.util.getServerUrl().local;
  phpURL = this.util.getServerUrl().remote;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router, private util: UtilityService) {
  }


  createJourney(name, description, files){
    let fd = new FormData();
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      fd.append(`images[]`, JSON.stringify({details: {
          make: files[i].details.make,
          model: files[i].details.model,
          dateTaken: files[i].details.dateTaken,
          location: files[i].details.location,
          resolution: files[i].details.resolution,
          flash: files[i].details.flash,
          iso: files[i].details.iso,
          focalLength: files[i].details.focalLength,
          size: files[i].details.size
        }}));
      fd.append(`${i}`, files[i].file);
    }
    fd.append('journey-data', JSON.stringify({name, description}));
    fd.append('authtoken', localStorage.getItem('authtoken'));

    return this.http.post(`${this.phpURL}/test/test.php`, fd, {});
  }


  extractFileLocation(pht): Array<Number>{
    if (pht.exifdata && (pht.exifdata.GPSLatitude || pht.exifdata.GPSLongitude)) {
      const gpsLat = pht.exifdata.GPSLatitude;
      let dLatitude = (gpsLat[0] + gpsLat[1] / 60.0 + gpsLat[2] / 3600.0).toFixed(5);
      const gpsLon = pht.exifdata.GPSLongitude;
      let dLongitude = (gpsLon[0] + gpsLon[1] / 60.0 + gpsLon[2] / 3600.0).toFixed(5);
      if(pht.exifdata.GPSLatitudeRef === 'S'){
        dLatitude *= -1;
      }
      if(pht.exifdata.GPSLongitudeRef === 'W'){
        dLongitude *=-1;
      }
      return [dLatitude,dLongitude];
    }
    return [];
  }

  extractFileResolution(pht): Array<Number>{
    if(pht.exifdata.PixelXDimension && pht.exifdata.PixelYDimension){
      return [pht.exifdata.PixelXDimension, pht.exifdata.PixelYDimension];
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
  getAllImages(): Observable<any>{
    return this.http.get(`${this.serverURL}/images/all`);
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
    console.log("INPUT:");
    console.log(journey);
    return this.http.put(`${this.serverURL}/journey/update/${journey._id}`, journey);
  }
  // DELETE
  deleteImageFromServer(img): Observable<any> {
    console.log("S INPUT: ");
    console.log(img);
    return this.http.post(`${this.serverURL}/images/delete`, img);
  }
  removePhotoFromDatabase(photoID) {
    console.log("DB INPUT: ");
    console.log(photoID);
    return this.http.delete(`${this.serverURL}/images/kinvey/delete/${photoID}`);
  }
  deleteJourney(journeyID): Observable<any> {
    return this.http.delete(`${this.serverURL}/journeys/delete/${journeyID}`);
  }


// additional function for getting IDs of journey photos - needed for testing purposes

// getJourneyPhotosIDs(journeyID) {
//     return this.http.get(`${this.serverURL}/images/ids/${journeyID}`);
//   }

}
