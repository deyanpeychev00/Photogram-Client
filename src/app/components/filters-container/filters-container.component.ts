import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ToastrService} from '../../services/toastr/toastr.service';

@Component({
  selector: 'app-filters-container',
  templateUrl: './filters-container.component.html',
  styleUrls: ['./filters-container.component.css']
})
export class FiltersContainerComponent implements OnInit {

  @Output() searchByAuthor = new EventEmitter<string>();
  @Output() searchInDateFrame = new EventEmitter<Array<string>>();
  searchedJourney = '';
  dateFrom = '';
  dateTo = '';

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '300px';
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
  }

  USearchSend(){
    this.searchByAuthor.emit(this.searchedJourney);
  }

  DateSearchSend(){
    if(this.dateFrom === '' || this.dateTo === ''){
      return;
    }
    if(new Date(this.dateFrom) < new Date(this.dateTo)){
      this.searchInDateFrame.emit([new Date(this.dateFrom).toISOString().substr(0, 10), new Date(this.dateTo).toISOString().substr(0, 10)]);
    }else{
      this.searchInDateFrame.emit([new Date(this.dateTo).toISOString().substr(0, 10), new Date(this.dateFrom).toISOString().substr(0, 10)]);
    }

  }

}
