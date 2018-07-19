import {Injectable} from '@angular/core';
import {ToastrService} from '../toastr/toastr.service';
import ImageCompressor from 'image-compressor.js';

declare const L: any;


@Injectable()
export class MapService {
  map: any;
  currentMarkers: any = [];

  startIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  finishIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  popup = {
    closeButton: false, autoClose: false
  };

  constructor(private toastr: ToastrService) {
  }

  clearMap() {
    this.currentMarkers = [];

    for (let i in this.map._layers) {
      if (this.map._layers[i].options.type === 'marker' || this.map._layers[i].options.type === 'polyline') {
        try {
          this.map.removeLayer(this.map._layers[i]);
        } catch (e) {
          this.toastr.errorToast('Възникна грешка при изчистването на картата. Моля презаредете страницата.');
        }
      }
    }
  }

  clearNeedlessPolylines() {
    for (let i in this.map._layers) {
      if (this.map._layers[i].options.type === 'polyline') {
        try {
          this.map.removeLayer(this.map._layers[i]);
        } catch (e) {
          this.toastr.errorToast('Възникна грешка при изчистването на картата. Моля презаредете страницата.');
        }
      }
    }
  }

  initMap(id) {
    const AT = 'pk.eyJ1IjoiZGV5YW5wZXljaGV2IiwiYSI6ImNqaDk1ODE5dTAwd3gyenBpcXZ0MDRrZjUifQ.dWIGnZF0Hf9SymQJJcFjYw';
    const LAYER = 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=';

    // set initial view to map with zoom level 2
    this.map = L.map(id).setView([17, 0], 2);

    // apply tile layer to map

    L.tileLayer(LAYER + AT, {
      maxZoom: 18, id: 'mapbox.streets', accessToken: AT
    }).addTo(this.map);

    return this.map;
  }

  setEmptyMap(id) {
    this.initMap(id);
  }

  displayPictureOnMap(pht) {

    if (!pht.prepareDelete) {
      // convert coordinates from exif data to decimals
      if(pht.location.length > 0){
        this.showRetrievedImage(pht);
      }

      /*    if (pht.file.exifdata && (pht.file.exifdata.GPSLatitude || pht.file.exifdata.GPSLongitude)) {
        const gpsLat = pht.file.exifdata.GPSLatitude;
        const dLatitude = (gpsLat[0] + gpsLat[1] / 60.0 + gpsLat[2] / 3600.0).toFixed(5);
        const gpsLon = pht.file.exifdata.GPSLongitude;
        const dLongitude = (gpsLon[0] + gpsLon[1] / 60.0 + gpsLon[2] / 3600.0).toFixed(5);
        this.currentMarkers.push({
          timestamp: pht.file.exifdata.DateTimeOriginal,
          coordinates: [dLatitude, dLongitude],
          thumbnail: pht.encoded,
          position: pht.position
        });
      }
      // create journey path
      this.connectJourneyMarkers();*/
    }

  }

  showRetrievedImage(pht){
    let obj = {
      timestamp: pht.dateTaken,
      coordinates: pht.location,
      thumbnail: pht.encoded ,
      position: pht.position,
      imgsrc: pht.fileName
    };
    if(obj.coordinates.length > 0) {
      this.currentMarkers.push(obj);

    }
    this.connectJourneyMarkers();
  }

  connectJourneyMarkers() {
    this.sortMarkers();

    try {
      this.currentMarkers.forEach(m => m.position = 'TRANSIT');
      this.currentMarkers[0].position = 'START';
      this.currentMarkers[this.currentMarkers.length - 1].position = 'FINISH';
    } catch (e) {
    }
    this.clearNeedlessPolylines();
    for (let pht of this.currentMarkers) {
      let popupHTML = `<img src="${pht.thumbnail || `${pht.imgsrc}`}" style="max-width: 100%; transform: scale(2); z-index: 1">`;

      if (pht.position === 'START') {
        const marker = L.marker(pht.coordinates, {type: 'marker', icon: this.startIcon})
          .addTo(this.map).bindPopup(popupHTML, this.popup);
      } else if (pht.position === 'FINISH') {
        const marker = L.marker(pht.coordinates, {type: 'marker', icon: this.finishIcon})
          .addTo(this.map).bindPopup(popupHTML, this.popup);
      } else {
        const marker = L.marker(pht.coordinates, {type: 'marker'})
          .addTo(this.map).bindPopup(popupHTML, this.popup);
      }
    }
    const polyline = L.polyline(this.currentMarkers.map(x => x.coordinates), {color: 'red', weight: 2, type: 'polyline'}).addTo(this.map);
    try {
      this.map.fitBounds(this.currentMarkers.map(x => x.coordinates));
    } catch (e) {
    }
  }

  sortMarkers() {
    this.currentMarkers.map(m => {
      let mTimestampDate: string = m.timestamp.substring(0, 10);
      mTimestampDate = mTimestampDate.replace(/:/g, '-'); // 20:03:06 -> 20-03-06 (suitable for parsing to Date)
      m.timestamp = mTimestampDate + m.timestamp.substring(10); // date timestamp converted to date format + hour timestamp
      m.date = new Date(m.timestamp);
    });

    this.currentMarkers = this.currentMarkers.sort(function (a, b) {
      return a.date - b.date;
    });
  }

  emptyMarkers() {
    this.currentMarkers = [];
    this.clearMap();
  }

  reDrawPointsOnPrevPicDelete(photo) {
    this.emptyMarkers();
    if (photo.prepareDelete === false || photo.prepareDelete === undefined) {
      this.displayPictureOnMap(photo);
    }
  }
}
