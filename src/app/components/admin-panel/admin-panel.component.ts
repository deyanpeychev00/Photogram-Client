import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {AdminService} from '../../services/admin/admin.service';
import {ToastrService} from '../../services/toastr/toastr.service';
import {JourneyService} from '../../services/journey/journey.service';

@Component({
  selector: 'app-admin-panel', templateUrl: './admin-panel.component.html', styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private auth: AuthService, private admin: AdminService, private toastr: ToastrService, private journeyService: JourneyService) {
  }

  users = [];
  usersShow = [];
  usersLoaded = false;
  currentUsername = '';
  currentUserID = '';
  databaseUserID = '';
  searchedUser = '';
  searchedID = '';
  searchedEmail = '';
  searchedFirstName = '';
  searchedLastName = '';

  journeys = [];
  journeysShow = [];
  journeysLoaded = false;
  currentJourneyId = '';
  searchedJourneyID = '';
  searchedJourneyName = '';
  searchedJourneyAuthor = '';

  ngOnInit() {
    if (!this.auth.pathAuthProtector()) {
      return;
    }
    if (!this.auth.pathAdminProtector()) {
      return;
    }
  }

  resetSearch(flag){
    if(flag === 'user'){
      [this.searchedID, this.searchedUser, this.searchedEmail, this.searchedFirstName, this.searchedLastName] = ['','','','',''];
      this.usersShow = this.users;
    }else if(flag === 'journey'){
      [this.searchedJourneyID, this.searchedJourneyName, this.searchedJourneyAuthor] = ['','',''];
      this.journeysShow = this.journeys;
    }
  }

  showSearchedUser(flag){
    if(flag === 'user'){
      [this.searchedID, this.searchedEmail, this.searchedFirstName, this.searchedLastName] = ['','','',''];
      this.usersShow = this.users.filter( u => u.username.toLowerCase().includes(this.searchedUser.toLowerCase()));
    }else if(flag === 'journey'){
      [this.searchedJourneyName, this.searchedJourneyID] = ['',''];
      this.journeysShow = this.journeys.filter( j => j.author.toLowerCase().includes(this.searchedJourneyAuthor.toLowerCase()));
    }
  }

  showSearchedStatus(flag){
    if(flag === 'blocked'){
      this.usersShow = this.users.filter( u => u.blocked === true);
    }else if(flag === 'active'){
      this.usersShow = this.users.filter( u => u.blocked === false);
    }
  }

  showSearchedID(flag){
    if(flag==='user'){
      [this.searchedUser, this.searchedEmail, this.searchedFirstName, this.searchedLastName] = ['','','',''];
      this.usersShow = this.users.filter( u => u._id.toLowerCase().includes(this.searchedID.toLowerCase()));
    }else if(flag === 'journey'){
      [this.searchedJourneyName, this.searchedJourneyAuthor] = ['',''];
      this.journeysShow = this.journeys.filter( j => j._id.toLowerCase().includes(this.searchedJourneyID.toLowerCase()));
    }
  }

  showSearchedEmail(){
    [this.searchedUser, this.searchedID, this.searchedFirstName, this.searchedLastName] = ['','','',''];
    this.usersShow = this.users.filter( u => u.email.toLowerCase().includes(this.searchedEmail.toLowerCase()));
  }

  showSearchedFirstName(){
    [this.searchedUser, this.searchedEmail, this.searchedID, this.searchedLastName] = ['','','',''];
    this.usersShow = this.users.filter( u => u.firstName.toLowerCase().includes(this.searchedFirstName.toLowerCase()));
  }

  showSearchedLastName(){
    [this.searchedUser, this.searchedEmail, this.searchedID, this.searchedFirstName] = ['','','',''];
    this.usersShow = this.users.filter( u => u.lastName.toLowerCase().includes(this.searchedLastName.toLowerCase()));
  }

  showSearchedJourneyName(){
    [this.searchedJourneyID, this.searchedJourneyAuthor] = ['',''];
    this.journeysShow = this.journeys.filter( j => j.name.toLowerCase().includes(this.searchedJourneyName.toLowerCase()));
  }

  openTab(evt: any, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';

    if (tabName === 'users') {
      this.getAllUsers();
    } else if (tabName === 'journeys') {
      this.getAllJourneys();
    }
  }

  getAllUsers() {
    this.admin.getAllUsers().subscribe(res => {
      this.users = res.data;
      this.usersShow = res.data;
      this.usersLoaded = true;
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });
  }

  getAllJourneys() {
    this.journeyService.getAllJourneysAdmin().subscribe((res:any) => {
      if(res.success){
        this.journeys = res.data;
        this.journeysShow = this.journeys;
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

  showUserModal(username, ID, DID){
    this.currentUsername = username;
    this.currentUserID = ID;
    this.databaseUserID = DID;
    document.getElementById('usersModal').style.display = 'block';
    window.onclick = (event) => {
      if (event.target === document.getElementById('myModal')) {
        this.closeModal('usersModal');
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
    this.journeyService.getJourneyPhotos(JID).subscribe((res: any) => {
      if(res.success){
        // delete journey pictures
        for (let pic of res.data) {
          this.deleteImage(pic);
        }

        // delete journey itself
        this.journeyService.deleteJourney(JID).subscribe(data => {
          this.toastr.successToast('Успешно изтрихте пътешествието');
          // remove journey from admin panel table

          let journey = this.journeys.find(x => x._id === JID);
          let journeyIndex = this.journeys.indexOf(journey);
          this.journeys.splice(journeyIndex, 1);
        }, err => {
          this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
        });

      }
    });

  }


  deleteImage(e) {
    this.journeyService.deleteImageFromServer(e).subscribe((res:any) => {
      if(res.success){
        this.journeyService.removePhotoFromDatabase(e._id);
      }else{
        this.toastr.errorToast(res.msg ? res.msg : "Възникна грешка, моля опитайте отново");
      }
    });
  }


  deleteUser(MID,UNAME = this.currentUsername, UID = this.currentUserID, DID = this.databaseUserID){
    this.closeModal(MID);
    // 1. Delete all user's journeys
    this.journeyService.getUserJourneys(UNAME).subscribe((res: any) => {
      for(let jr of res.data ){
        this.deleteJourney('usersModal', jr._id);
      }
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });

    // 2. Delete user
    this.admin.deleteUserFromServer(UID).subscribe((res: any) => {
      if(res.success){
        this.admin.deleteUserFromDataBase(DID).subscribe((dres: any) => {
          if(dres.success){
            this.toastr.successToast('Успешно изтрихте потребителя');

            let user = this.users.find(x => x.UID === UID);
            let userIndex = this.users.indexOf(user);
            this.users.splice(userIndex, 1);
          }
        },err => {
            this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
          });
      }

    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });
  }

  changeBlockedStatus(id){
    let user = this.users.find(x => x._id === id);
    let userIndex = this.users.indexOf(user);
    this.users[userIndex].blocked = !this.users[userIndex].blocked;

    this.admin.updateUser(id, user).subscribe(data => {
        this.toastr.successToast(this.users[userIndex].blocked ? 'Потребителят е блокиран' : 'Потребителят е отблокиран');
        localStorage.setItem('status', this.users[userIndex].blocked.toString());
      },
      err => {
        this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
      });
  }

  sortByID(type, table){
    if(table === 'users'){
      if(type === 'asc'){
        this.usersShow.sort(function(a,b) {return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.usersShow.sort(function(a,b) {return (a._id > b._id) ? -1 : ((b._id > a._id) ? 1 : 0);} );
      }
    } else if (table === 'journeys'){
      if(type === 'asc'){
        this.journeysShow.sort(function(a,b) {return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.journeysShow.sort(function(a,b) {return (a._id > b._id) ? -1 : ((b._id > a._id) ? 1 : 0);} );
      }
    }
  }

  sortByName(type, table){
    if(table === 'users'){
      if(type === 'asc'){
        this.usersShow.sort(function(a,b) {return (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.usersShow.sort(function(a,b) {return (a.username > b.username) ? -1 : ((b.username > a.username) ? 1 : 0);} );
      }
    } else if (table === 'journeys'){
      if(type === 'asc'){
        this.journeysShow.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.journeysShow.sort(function(a,b) {return (a.name > b.name) ? -1 : ((b.name > a.name) ? 1 : 0);} );
      }
    } else if (table === 'journeys-author'){
      if(type === 'asc'){
        this.journeysShow.sort(function(a,b) {return (a.author > b.author) ? 1 : ((b.author > a.author) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.journeysShow.sort(function(a,b) {return (a.author > b.author) ? -1 : ((b.author > a.author) ? 1 : 0);} );
      }
    }
  }

  sortByEmail(type){
    if(type === 'asc'){
      this.usersShow.sort(function(a,b) {return (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0);} );
    }
    if(type === 'desc'){
      this.usersShow.sort(function(a,b) {return (a.email > b.email) ? -1 : ((b.email > a.email) ? 1 : 0);} );
    }
  }

  sortByNames(type, col){
    if(col === 'first'){
      if(type === 'asc'){
        this.usersShow.sort(function(a,b) {return (a.firstName > b.firstName) ? 1 : ((b.firstName > a.firstName) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.usersShow.sort(function(a,b) {return (a.firstName > b.firstName) ? -1 : ((b.firstName > a.firstName) ? 1 : 0);} );
      }
    }else if(col === 'last'){
      if(type === 'asc'){
        this.usersShow.sort(function(a,b) {return (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0);} );
      }
      if(type === 'desc'){
        this.usersShow.sort(function(a,b) {return (a.lastName > b.lastName) ? -1 : ((b.lastName > a.lastName) ? 1 : 0);} );
      }
    }
  }

}
