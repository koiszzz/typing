import {Injectable} from '@angular/core';
import {User} from '../user.model';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {contentHeaders} from '../config/headers';
import {catchError, map, retry} from 'rxjs/operators';
import {Response} from './responce';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {BaseService} from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  userStream: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient,
              private jwtHelperService: JwtHelperService,
              private router: Router) {
    super();
    const token = sessionStorage.getItem('token');
    if (token && !this.jwtHelperService.isTokenExpired(token)) {
      this.userStream.next(this.getUserInfo());
    }
  }

  /**
   * 登入
   * @param account 账号
   * @param password 密码
   */
  login(account: string , password: string): Observable<any> {
    const url = this.baseUrl + '/user/login';
    return this.http.post(url , {account , password} , {
      headers: contentHeaders
    }).pipe(
      retry(3),
      map((res) => {
        const resp = res as Response;
        if (resp.status) {
          sessionStorage.setItem('token' , resp.data);
          this.userStream.next(this.getUserInfo());
          this.router.navigate(['/main']);
          return resp.data;
        } else {
          throwError(resp.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 检查是否登陆
   */
  loggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    if (token) {
      return !this.jwtHelperService.isTokenExpired(token);
    }
    return false;
  }

  /**
   * 登出
   */
  logOut() {
    // 直接清空
    sessionStorage.clear();
    this.userStream.next(null);
    this.router.navigate(['/intro']);
  }

  getUserInfo(): User {
    return this.jwtHelperService.decodeToken(sessionStorage.getItem('token')) as User;
  }
}
