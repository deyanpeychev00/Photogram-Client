import {Component, OnInit} from '@angular/core';
import {ToastrService} from '../../services/toastr/toastr.service';

declare const $: any;

@Component({
  selector: 'app-journey-comments-sidebar',
  templateUrl: './journey-comments-sidebar.component.html',
  styleUrls: ['./journey-comments-sidebar.component.css']
})
export class JourneyCommentsSidebarComponent implements OnInit {

  constructor(private toastr: ToastrService) {
  }

  imageComments = [{
    comment: 'This is a square image. Add the "circle" class to it to make it appear circular.',
    date: '08-10-2018',
    name: 'Ivan Ivanov',
    user: 'sample_username',
    avatarSrc: '../../../assets/images/default-avatar.png'
  }, {
    comment: 'This is a square image. Add the "circle" class to it to make it appear circular.',
    date: '08-10-2018',
    name: 'Ivan Ivanov',
    user: 'sample_username',
    avatarSrc: '../../../assets/images/default-avatar.png'
  }, {
    comment: 'This is a square image. Add the "circle" class to it to make it appear circular.',
    date: '08-10-2018',
    name: 'Ivan Ivanov',
    user: 'sample_username',
    avatarSrc: '../../../assets/images/default-avatar.png'
  }, {
    comment: 'This is a square image. Add the "circle" class to it to make it appear circular.',
    date: '08-10-2018',
    name: 'Ivan Ivanov',
    user: 'sample_username',
    avatarSrc: '../../../assets/images/default-avatar.png'
  }, {
    comment: 'This is a square image. Add the "circle" class to it to make it appear circular.',
    date: '08-10-2018',
    name: 'Ivan Ivanov',
    user: 'sample_username',
    avatarSrc: '../../../assets/images/default-avatar.png'
  }, {
    comment: 'This is a square image. Add the "circle" class to it to make it appear circular.',
    date: '08-10-2018',
    name: 'Ivan Ivanov',
    user: 'sample_username',
    avatarSrc: '../../../assets/images/default-avatar.png'
  }, {
    comment: 'This is a square image. Add the "circle" class to it to make it appear circular.',
    date: '08-10-2018',
    name: 'Ivan Ivanov',
    user: 'sample_username',
    avatarSrc: '../../../assets/images/default-avatar.png'
  }];

  sidebarOpened = false;
  myComment = '';

  ngOnInit() {
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '100%';
    this.sidebarOpened = true;
  }

  closeNav() {
    this.sidebarOpened = false;
    document.getElementById('mySidenav').style.width = '0';
  }

  prepareComment(ev) {
    this.myComment = ev.target.value;
  }

  submitComment() {
    if (this.myComment.trim() !== '') {
      this.imageComments.splice(0, 0, {
        comment: this.myComment,
        user: localStorage.getItem('username'),
        date: '10-10-2019',
        name: localStorage.getItem('name'),
        avatarSrc: '../../../assets/images/default-avatar.png'
      });
      $('.commentTextarea').val('');
      this.myComment = '';
      window.scrollTo(0,0);
    }
  }
}
