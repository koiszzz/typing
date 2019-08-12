import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {BaseService} from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService extends BaseService {

  constructor(private sb: MatSnackBar,
              private http: HttpClient) {
    super();
  }

  getData(url: string, params?: {
    [param: string]: string | string[];
  }) {
    return this.http.get(this.baseUrl + url, {params}).pipe(
      map((res: { status: boolean, message: string, data: any }) => {
        if (res.status) {
          console.log(res.message);
        } else {
          this.sb.open(res.message, '关闭');
        }
        return res.data;
      }),
      catchError(this.handleError)
    );
  }

  postData(url: string,
           body: any,
           options?: {
             [key: string]: string | number | boolean
           }) {
    return this.http.post(this.baseUrl + url, body).pipe(
      map((res: { status: boolean, message: string, data: any }) => {
        if (options && options.showMessage) {
          if (res.status) {
            this.sb.open(res.message, '关闭', {duration: 2000});
          } else {
            this.sb.open(res.message, '关闭');
          }
        }
        if (options && options.allMessage) {
          return res;
        } else {
          if (res.data) {
            return res.data;
          }
          return res.status;
        }
      })
    );
  }

  deleteData(url: string, params: {
    [param: string]: string | string[];
  }) {
    return this.http.delete(this.baseUrl + url, {params}).pipe(
      map((res: { status: boolean, message: string }) => {
        if (res.status) {
          this.sb.open(res.message, '关闭', {duration: 2000});
        } else {
          this.sb.open(res.message, '关闭');
        }
        return res.status;
      })
    );
  }
}
