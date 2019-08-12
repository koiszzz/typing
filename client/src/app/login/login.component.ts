import {Component , OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  public signIn(account, password, event): void {
    this.auth.login(account, password).subscribe(data => {
      console.log('some thing get', data);
    });
    event.preventDefault();
  }

}
