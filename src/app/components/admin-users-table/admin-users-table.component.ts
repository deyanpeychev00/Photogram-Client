import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin/admin.service';
import {ToastrService} from '../../services/toastr/toastr.service';

@Component({
  selector: 'app-admin-users-table',
  templateUrl: './admin-users-table.component.html',
  styleUrls: ['./admin-users-table.component.css', './../admin-panel/admin-panel.component.css']
})
export class AdminUsersTableComponent implements OnInit {
  myID = localStorage.getItem('userId');
  users = [];
  usersShow = [];
  usersLoaded = false;
  currentUserID = '';
  searchedUser = '';
  searchedID = '';
  searchedEmail = '';
  searchedFirstName = '';
  searchedLastName = '';

  constructor(private admin: AdminService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllUsers();
  }

  // users CRUD functions
  getAllUsers() {
    this.admin.getAllUsers().subscribe(res => {
      this.users = res.data;
      this.usersShow = res.data;
      this.usersLoaded = true;
    }, err => {
      this.toastr.errorToast((err.error.description ? err.error.description : 'Възникна грешка, моля опитайте отново'));
    });
  }
  deleteUser(modalID, id = this.currentUserID) {
    this.closeModal(modalID);
    this.admin.deleteUser(id).subscribe((res: any) => {
      if (res === null) {
        this.toastr.errorToast('Възникна грешка, моля опитайте по-късно.');
      }
      if (res.success) {
        this.toastr.successToast(res.msg);
        let user = this.users.find(x => x.id === id);
        let userIndex = this.users.indexOf(user);
        this.users.splice(userIndex, 1);
      } else {
        this.toastr.errorToast(res.msg);
      }
    }, err => {
    });
  }
  changeBlockedStatus(id) {
    let userToUpdate = this.users.find(u => u.id === id);
    userToUpdate.blocked = !userToUpdate.blocked;
    this.admin.updateUser(userToUpdate).subscribe((res: any) => {
      if (res.data.blocked) {
        this.toastr.toast('Потребителят е блокиран.');
      } else {
        this.toastr.toast('Потребителят е отблокиран.');
      }
    });
  }

  // Filter search
  resetSearch() {
    [this.searchedID, this.searchedUser, this.searchedEmail, this.searchedFirstName, this.searchedLastName] = ['', '', '', '', ''];
    this.usersShow = this.users;
  }
  showSearchedUser() {
    [this.searchedID, this.searchedEmail, this.searchedFirstName, this.searchedLastName] = ['', '', '', ''];
    this.usersShow = this.users.filter(u => u.username.toLowerCase().includes(this.searchedUser.toLowerCase()));
  }
  showSearchedStatus(flag) {
    if (flag === 'blocked') {
      this.usersShow = this.users.filter(u => u.blocked === true);
    } else if (flag === 'active') {
      this.usersShow = this.users.filter(u => u.blocked === false);
    }
  }
  showSearchedID(flag) {
    [this.searchedUser, this.searchedEmail, this.searchedFirstName, this.searchedLastName] = ['', '', '', ''];
    this.usersShow = this.users.filter(u => u.id.toString().toLowerCase().includes(this.searchedID.toLowerCase()));
  }
  showSearchedEmail() {
    [this.searchedUser, this.searchedID, this.searchedFirstName, this.searchedLastName] = ['', '', '', ''];
    this.usersShow = this.users.filter(u => u.email.toLowerCase().includes(this.searchedEmail.toLowerCase()));
  }
  showSearchedFirstName() {
    [this.searchedUser, this.searchedEmail, this.searchedID, this.searchedLastName] = ['', '', '', ''];
    this.usersShow = this.users.filter(u => u.firstName.toLowerCase().includes(this.searchedFirstName.toLowerCase()));
  }
  showSearchedLastName() {
    [this.searchedUser, this.searchedEmail, this.searchedID, this.searchedFirstName] = ['', '', '', ''];
    this.usersShow = this.users.filter(u => u.lastName.toLowerCase().includes(this.searchedLastName.toLowerCase()));
  }

  // Operate modals (for user delete confirmation)
  showUserModal(id) {
    this.currentUserID = id;
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

  // Table sorting functions
  sortByID(type) {
    if (type === 'asc') {
      this.usersShow.sort(function (a, b) {
        return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
      });
    }
    if (type === 'desc') {
      this.usersShow.sort(function (a, b) {
        return (a.id > b.id) ? -1 : ((b.id > a.id) ? 1 : 0);
      });
    }
  }
  sortByName(type) {
    if (type === 'asc') {
      this.usersShow.sort(function (a, b) {
        return (a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : ((b.username.toLowerCase() > a.username.toLowerCase()) ? -1 : 0);
      });
    }
    if (type === 'desc') {
      this.usersShow.sort(function (a, b) {
        return (a.username.toLowerCase() > b.username.toLowerCase()) ? -1 : ((b.username.toLowerCase() > a.username.toLowerCase()) ? 1 : 0);
      });
    }
  }
  sortByEmail(type) {
    if (type === 'asc') {
      this.usersShow.sort(function (a, b) {
        return (a.email.toLowerCase() > b.email.toLowerCase()) ? 1 : ((b.email.toLowerCase() > a.email.toLowerCase()) ? -1 : 0);
      });
    }
    if (type === 'desc') {
      this.usersShow.sort(function (a, b) {
        return (a.email.toLowerCase() > b.email.toLowerCase()) ? -1 : ((b.email.toLowerCase() > a.email.toLowerCase()) ? 1 : 0);
      });
    }
  }
  sortByNames(type, col) {
    if (col === 'first') {
      if (type === 'asc') {
        this.usersShow.sort(function (a, b) {
          return (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : ((b.firstName.toLowerCase() > a.firstName.toLowerCase()) ? -1 : 0);
        });
      }
      if (type === 'desc') {
        this.usersShow.sort(function (a, b) {
          return (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? -1 : ((b.firstName.toLowerCase() > a.firstName.toLowerCase()) ? 1 : 0);
        });
      }
    } else if (col === 'last') {
      if (type === 'asc') {
        this.usersShow.sort(function (a, b) {
          return (a.lastName.toLowerCase() > b.lastName.toLowerCase()) ? 1 : ((b.lastName.toLowerCase() > a.lastName.toLowerCase()) ? -1 : 0);
        });
      }
      if (type === 'desc') {
        this.usersShow.sort(function (a, b) {
          return (a.lastName.toLowerCase() > b.lastName.toLowerCase()) ? -1 : ((b.lastName.toLowerCase() > a.lastName.toLowerCase()) ? 1 : 0);
        });
      }
    }
  }
}
