import { Component, OnInit } from '@angular/core';
import {JourneyService} from '../../services/journey/journey.service';
import {ToastrService} from '../../services/toastr/toastr.service';

@Component({
  selector: 'app-admin-journeys-table',
  templateUrl: './admin-journeys-table.component.html',
  styleUrls: ['./admin-journeys-table.component.css', './../admin-panel/admin-panel.component.css']
})
export class AdminJourneysTableComponent implements OnInit {

  journeys = [];
  journeysShow = [];
  journeysLoaded = false;
  currentJourneyId = '';
  searchedJourneyID = '';
  searchedJourneyName = '';
  searchedJourneyAuthor = '';

  constructor(private journeyService: JourneyService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getJourneys();
  }
  getJourneys() {
    this.journeyService.getAllJourneysAdmin().subscribe((res:any) => {
      if(res.success){
        this.journeysShow = this.journeys = res.data;
        this.journeysLoaded = true;
      }else{
        this.toastr.errorToast((res.msg ? res.msg : 'Възникна грешка, моля опитайте отново'));

      }
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });
  }

  showJourneyModal(journeyId) {
    this.currentJourneyId = journeyId;
    document.getElementById('journeyModal').style.display = 'block';
    window.onclick = (event) => {
      if (event.target === document.getElementById('myModal')) {
        this.closeModal('journeyModal');
      }
    };
  }
  closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }
  deleteJourney(MID, JID = this.currentJourneyId) {
    // MID => modal ID ; JID => journey ID
    this.closeModal(MID);
    this.toastr.toast('Изтриване на пътешествието..');
    // get journey pictures
    this.journeyService.deleteJourney(JID).subscribe((res: any) => {
      if(res === null && !res.success){
        this.toastr.errorToast('Възникна грешка, моля опитайте по-късно');
        return;
      }else if(res.success){
        this.toastr.successToast(res.msg);
        let journey = this.journeys.find(x => x.id === JID);
        let journeyIndex = this.journeys.indexOf(journey);
        this.journeys.splice(journeyIndex, 1);
      }
    },err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново.'));
    });
  }

  sortByID(type){
    if(type === 'asc'){
      this.journeysShow.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
    }
    if(type === 'desc'){
      this.journeysShow.sort(function(a,b) {return (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0);} );
    }
  }
  sortByName(type, table){
    if (table === 'journeys'){
      if(type === 'asc'){
        this.journeysShow.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.journeysShow.sort(function(a,b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : 0);} );
      }
    } else if (table === 'journeys-author'){
      if(type === 'asc'){
        this.journeysShow.sort(function(a,b) {return (a.author.toLowerCase() > b.author.toLowerCase()) ? 1 : ((b.author.toLowerCase() > a.author.toLowerCase()) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.journeysShow.sort(function(a,b) {return (a.author.toLowerCase() > b.author.toLowerCase()) ? -1 : ((b.author.toLowerCase() > a.author.toLowerCase()) ? 1 : 0);} );
      }
    }
  }

  resetSearch(flag){
    [this.searchedJourneyID, this.searchedJourneyName, this.searchedJourneyAuthor] = ['','',''];
    this.journeysShow = this.journeys;
  }
  showSearchedUser(flag){
    [this.searchedJourneyName, this.searchedJourneyID] = ['',''];
    this.journeysShow = this.journeys.filter( j => j.author.toLowerCase().includes(this.searchedJourneyAuthor.toLowerCase()));
  }
  showSearchedID(flag){
    [this.searchedJourneyName, this.searchedJourneyAuthor] = ['',''];
    this.journeysShow = this.journeys.filter( j => j.id.toString().toLowerCase().includes(this.searchedJourneyID.toLowerCase()));
  }
  showSearchedJourneyName(){
    [this.searchedJourneyID, this.searchedJourneyAuthor] = ['',''];
    this.journeysShow = this.journeys.filter( j => j.name.toLowerCase().includes(this.searchedJourneyName.toLowerCase()));
  }
}
