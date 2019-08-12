import { Component, OnInit } from '@angular/core';
import {User} from '../../user.model';
import {AuthService} from '../../auth/auth.service';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {CommonService} from '../common.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-user-info-editor',
  templateUrl: './user-info-editor.component.html',
  styleUrls: ['./user-info-editor.component.css']
})
export class UserInfoEditorComponent implements OnInit {
  user: User;
  certNo = new FormControl();
  age;
  constructor(private as: AuthService,
              private dp: DatePipe,
              private cs: CommonService,
              private sb: MatSnackBar) { }

  ngOnInit() {
    const now = this.dp.transform(new Date(), 'yyyyMMdd');
    this.certNo.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(
      v => {
        if (v.length >= 14) {
          this.age = Math.floor((parseInt(now, 0) - parseInt(v.substr(6, 8), 0)) / 10000);
        }
      }
    );
    this.user = this.as.getUserInfo();
    this.cs.getData('/auth/user/ext').subscribe(
      data => {
        if (data) {
          this.certNo.patchValue(data.certNo);
        }
      }
    );
  }

  save() {
    if (this.certNo.value.length !== 18) {
      this.sb.open('请输入有效的证件号码', '关闭', {duration: 2000});
      return;
    }
    this.cs.postData('/auth/user/ext', {certNo: this.certNo.value, age: this.age}).subscribe();
  }
}
