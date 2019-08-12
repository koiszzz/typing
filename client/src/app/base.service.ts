import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {environment} from '../environments/environment';

export class BaseService {
  baseUrl: string = environment.apiUrl;

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log(`客户端出现错误: ${error.error.message}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(`后台返回错误代码 ${error.status},内容: ${error.message}`);
    }
    // return an observable with a user-facing error message
    return throwError(error.message);
  }
}
