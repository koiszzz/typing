import { Component, OnInit } from '@angular/core';
import {User} from '../../user.model';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: User;
  constructor(private as: AuthService) {
    this.user = this.as.getUserInfo();
  }

  ngOnInit() {
  }

}
