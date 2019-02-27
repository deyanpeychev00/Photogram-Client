import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from '../toastr/toastr.service';
import {Router} from '@angular/router';
import {UtilityService} from '../utility/utility.service';

@Injectable()
export class CommentsService {
  phpURL = this.util.getServerUrl().remote;
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router, private util: UtilityService) { }

  addComment(comment): Observable<any>{
    let fd = new FormData();
    fd.append('comment-data', JSON.stringify(comment));

    return this.http.post(`${this.phpURL}/api/comments/add.php`, fd, {
      headers: new HttpHeaders().set('Authentication', `Bearer ${localStorage.getItem('authtoken')}`)
    });
  }

}
