import {Injectable} from '@angular/core';
import {ToastrService} from '../toastr/toastr.service';
import {UtilityService} from '../utility/utility.service';
import '../../../assets/js/leaflet-heat';
import {JourneyService} from '../journey/journey.service';
import {DataService} from '../data/data.service';
import {Router} from '@angular/router';

declare const L: any;
declare const $: any;

@Injectable()
export class MapService {
  map: any;
  currentMarkers: any = [];

  startIcon = new L.Icon({
    iconUrl: 'assets/map/marker-icon-2x-green.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });
  finishIcon = new L.Icon({
    iconUrl: 'assets/map/marker-icon-2x-red.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });
  transitIcon = new L.Icon({
    iconUrl: 'assets/map/marker-icon-2x-grey.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });
  locationIcon = new L.Icon({
    iconUrl: 'assets/map/marker-icon-2x-location.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });
  popup = {
    closeButton: false
  };

  constructor(private toastr: ToastrService, private util: UtilityService, private journeyService: JourneyService, private dataService: DataService, private router: Router) {
  }

  drawMapDensityLayer(data, type) {
    if (type === 'heatmap') {
      let locationsArray = data.map(d => d.location);
      let heat = L.heatLayer(locationsArray, {type: 'heatmap', radius: 20, minOpacity: 0.65})
        .addTo(this.map);
    } else if (type === 'locations') {
      for (let dataCoordinates of data) {
        let popupHTML = this.util.generateMarkerPopup(dataCoordinates, 'locations');
        const marker = L.marker(dataCoordinates.location, {type: 'marker', icon: this.locationIcon}).addTo(this.map);
        marker.bindPopup(popupHTML, this.popup);
      }
    }
  }

  setDensityMapType(type) {
    this.journeyService.getAllImagesLocations().subscribe((res: any) => {
      if (res === null || !res.success) {
        this.toastr.errorToast(res.msg);
        return;
      }
      this.drawMapDensityLayer(res.data, type);
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.'));
    });
  }

  showDensityMap() {
    this.clearMap();
    this.setDensityMapType('heatmap');
  }

  showLocationsMap() {
    this.clearMap();
    this.setDensityMapType('locations');
  }

  clearMap() {
    this.currentMarkers = [];

    for (let i in this.map._layers) {
      if (this.map._layers[i].options.type === 'marker' || this.map._layers[i].options.type === 'polyline' || this.map._layers[i].options.type === 'heatmap') {
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

  initMap(id, zoomLevel = 2) {
    // get map authtoken and layer from utility service
    const AT = this.util.getMapDetails().authtoken;
    const LAYER = this.util.getMapDetails().layer;
    // set initial view to map with zoom level 2
    this.map = L.map(id).setView([17, 0], zoomLevel);
    // apply tile layer to map
    L.tileLayer(LAYER + AT, {
      maxZoom: 18, id: 'mapbox.streets', accessToken: AT
    }).addTo(this.map);

    return this.map;
  }

  setEmptyMap(id, zoomLevel = 2) {
    this.initMap(id, zoomLevel);
  }

  showRetrievedImage(pht, imagePath) {
    let obj = {
      make: pht.make || '',
      model: pht.model || '',
      comment: pht.comment || '',
      id: pht.id || '',
      timestamp: pht.dateTaken,
      coordinates: pht.location,
      thumbnail: pht.encoded,
      position: pht.position,
      imgsrc: imagePath || pht.fileName,
      displayType: pht.displayType
    };
    if (obj.coordinates.length > 0) {
      obj.coordinates = obj.coordinates.map(x => Number(x));
      this.currentMarkers.push(obj);
    }
    this.connectJourneyMarkers();
  }

  connectEditMarkers(markers) {
    this.currentMarkers = markers;
    this.connectJourneyMarkers();
  }

  drawMarker(pht) {
    pht.coordinates = pht.coordinates.map(x => Number(x));
    let popupHTML = this.util.generateMarkerPopup(pht, pht.displayType);

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
        this.drawMarker(pht);
      }
    }
    const polyline = L.polyline(this.currentMarkers.map(x => x.coordinates).filter(x => x.length > 0), {
      color: 'red', weight: 1, type: 'polyline'
    }).addTo(this.map);
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
}
