/**
 * Created by hsysa on 2016/12/1.
 */
import {HttpHeaders} from '@angular/common/http';

export const contentHeaders = new HttpHeaders()
  .append('Accept', 'application/json')
  .append('Content-Type', 'application/json');
