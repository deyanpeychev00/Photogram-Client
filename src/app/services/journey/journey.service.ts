import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from '../toastr/toastr.service';
import {Router} from '@angular/router';
import {UtilityService} from '../utility/utility.service';

@Injectable()
export class JourneyService {
  phpURL = this.util.getServerUrl().remote;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router, private util: UtilityService) {
  }

  createJourney(name, description, files){
    let fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append(`images[]`, JSON.stringify({
          make: files[i].details.make,
          model: files[i].details.model,
          dateTaken: files[i].details.dateTaken,
          location: files[i].details.location,
          resolution: files[i].details.resolution,
          flash: files[i].details.flash,
          iso: files[i].details.iso.length && files[i].details.iso.length > 0 ? files[i].details.iso[0] : files[i].details.iso,
          focalLength: files[i].details.focalLength,
          size: files[i].details.size,
          comment: files[i].details.comment
        }));
      fd.append(`${i}`, files[i].file);
    }
    fd.append('journey-data', JSON.stringify({name, description}));

    return this.http.post(`${this.phpURL}/api/journeys/create.php`, fd, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
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

  // RETRIEVE
  getCurrentJourney(journeyID): Observable<any> {
    return this.http.get(`${this.phpURL}/api/journeys/single.php/${journeyID}`, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
  getAllJourneysAdmin(): Observable<any> {
    return this.http.get(`${this.phpURL}/api/journeys/all.php/all`, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
  getAllJourneys(skipJourneyCount): Observable<any> {
    return this.http.get(`${this.phpURL}/api/journeys/all.php/${skipJourneyCount}`, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
  getUserJourneys(username, skipJourneyCount): Observable<any>{
    return this.http.get(`${this.phpURL}/api/journeys/all.php/${skipJourneyCount}?username=${username}`, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
  getJourneysInDateFrame(from, to, skipJourneyCount): Observable<any> {
    return this.http.get(`${this.phpURL}/api/journeys/all.php/${skipJourneyCount}?from=${from}&to=${to}`,{
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
  getAllImages(skipImagesCount): Observable<any>{
    return this.http.get(`${this.phpURL}/api/images/all.php/${skipImagesCount}`,{
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
  getAllImagesLocations(): Observable<any>{
    return this.http.get(`${this.phpURL}/api/images/locations.php`,{
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }

  // UPDATE
  updateJourney(journey, files = [], forUpdate = []): Observable<any> {
    let fd = new FormData();

    for (let i = 0; i < files.length; i++) {
      fd.append(`imagesForUpload[]`, JSON.stringify({
        make: files[i].details.make,
        model: files[i].details.model,
        dateTaken: files[i].details.dateTaken,
        location: files[i].details.location,
        resolution: files[i].details.resolution,
        flash: files[i].details.flash,
        iso: files[i].details.iso.length && files[i].details.iso.length > 0 ? files[i].details.iso[0] : files[i].details.iso,
        focalLength: files[i].details.focalLength,
        size: files[i].details.size,
      }));
      fd.append(`${i}`, files[i].file);
    }
    for (let i = 0; i < forUpdate.length; i++) {
      fd.append(`imagesForUpdate[]`, JSON.stringify(forUpdate[i]));
    }

    fd.append('journey-data', JSON.stringify(journey));

    return this.http.post(`${this.phpURL}/api/journeys/update.php/${journey.id}`, fd, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
  // DELETE
  deleteImage(id): Observable<any> {
    return this.http.delete(`${this.phpURL}/api/images/delete.php/${id}`,{
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }
  deleteJourney(journeyID): Observable<any> {
    return this.http.delete(`${this.phpURL}/api/journeys/delete.php/${journeyID}`, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }

}
