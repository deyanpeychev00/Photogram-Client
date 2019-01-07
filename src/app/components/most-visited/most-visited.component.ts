import { Component, OnInit } from '@angular/core';
import {MapService} from '../../services/map/map.service';

declare const $: any;

@Component({
  selector: 'app-most-visited',
  templateUrl: './most-visited.component.html',
  styleUrls: ['./most-visited.component.css']
})
export class MostVisitedComponent implements OnInit {
  pageHeight = $(document).height() - 70; // actual page height - navigation bar height

  constructor(private map: MapService) { }

  ngOnInit() {
    $('#densityMap').css('height', this.pageHeight);
    this.map.setEmptyMap('densityMap', 2);
    this.showDensityMap();
  }

  showDensityMap(){
    console.log('density');
    this.map.showDensityMap();
  }

  showLocationsMap(){
    console.log('locations');
    this.map.showLocationsMap();
  }

}
