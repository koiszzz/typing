import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CommonService} from '../common.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExamResolveService implements Resolve<any> {
  constructor(private router: Router,
              private cs: CommonService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.cs.postData('/auth/candidate/init',
      {id: route.queryParamMap.get('id')}, {
        allMessage: true,
        showMessage: true,
      }).pipe(
      map(res => {
        if (res.status) {
          return res.data;
        } else {
          this.router.navigateByUrl('/main/part');
          return null;
        }
      })
    );
  }
}
