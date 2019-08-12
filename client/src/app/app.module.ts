import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth.guard';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {JwtModule} from '@auth0/angular-jwt';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import localeCn from '@angular/common/locales/zh-Hans';
import {MaterialModule} from './shared/material.module';

registerLocaleData(localeCn, 'zh-Hans');

export function getToken() {
  return sessionStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['localhost:3000/user/login'],
        throwNoTokenError: false,
        skipWhenExpired: true
      }
    }),
    AppRoutingModule,
    MaterialModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    {provide: LOCALE_ID, useValue: 'zh-Hans'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
