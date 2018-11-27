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
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  finishIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  transitIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
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

  showRetrievedImage(pht, imagePath) {
    let obj = {
      timestamp: pht.dateTaken, coordinates: pht.location, thumbnail: pht.encoded, position: pht.position, imgsrc: imagePath || pht.fileName
    };
    if (obj.coordinates.length > 0) {
      obj.coordinates = obj.coordinates.map(x => Number(x));
      this.currentMarkers.push(obj);
    }
    this.connectJourneyMarkers();
  }

  connectEditMarkers(markers) {
    this.currentMarkers = markers;
    // this.sortMarkers();
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
      if (pht.coordinates.length > 0) {
        pht.coordinates = pht.coordinates.map(x => Number(x));
        let popupHTML = `<img src="${pht.thumbnail || `${pht.imgsrc}`}" style="max-width: 100%; transform: scale(2); z-index: 1">`;
        if (pht.position === 'START') {
          const marker = L.marker(pht.coordinates, {type: 'marker', icon: this.startIcon})
            .addTo(this.map);
          if (pht.thumbnail || pht.imgsrc) {
            marker.bindPopup(popupHTML, this.popup);
          }
        } else if (pht.position === 'FINISH') {
          const marker = L.marker(pht.coordinates, {type: 'marker', icon: this.finishIcon})
            .addTo(this.map);
          if (pht.thumbnail || pht.imgsrc) {
            marker.bindPopup(popupHTML, this.popup);
          }
        } else {
          const marker = L.marker(pht.coordinates, {type: 'marker', icon: this.transitIcon})
            .addTo(this.map);
          if (pht.thumbnail || pht.imgsrc) {
            marker.bindPopup(popupHTML, this.popup);
          }
        }
      }
    }
    const polyline = L.polyline(this.currentMarkers.map(x => x.coordinates).filter(x => x.length > 0), {color: 'red', weight: 2, type: 'polyline'}).addTo(this.map);
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
      this.showRetrievedImage(photo, undefined);
    }
  }
}
