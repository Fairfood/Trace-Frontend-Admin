/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import totp from 'totp-generator';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  sub: Subscription;
  constructor(public router: Router, public http: HttpClient) {}

  forgotPassword(param: any) {
    return this.http.post(BASE_URL + '/accounts/password/forgot/', {
      email: param,
    });
  }

  login(params: any) {
    return this.http.post(BASE_URL + '/accounts/admin/login/', params);
  }

  checkPassword(params: any) {
    return this.http.post(BASE_URL + '/accounts/check/password/', params);
  }

  logout(): void {
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      const reqObj = {
        device_id: deviceId,
      };
      this.sub = this.http
        .post(`${BASE_URL}/accounts/logout/`, reqObj, this.options())
        .subscribe(
          () => {
            this.logoutWithoutApi();
          },
          () => {
            this.logoutWithoutApi();
          }
        );
    }
  }
  logoutWithoutApi(): void {
    localStorage.clear();
    window.location.href = environment.authUrl + '/logout';
  }

  logoutFromTabs() {
    localStorage.removeItem('isFairfoodAdminLoggedin');
    localStorage.removeItem('adminData');
    localStorage.removeItem('companyID');
    console.log('User Logged Out!');
  }

  generateTotpToken(): string {
    const otp = totp(environment.totpToken);
    return otp;
  }

  magicLogin(params: any): Observable<any> {
    const headers = new HttpHeaders({
      otp: this.generateTotpToken(),
    });
    const options = { headers: headers };
    return this.http.post(BASE_URL + '/accounts/login/magic/', params, options);
  }

  options() {
    const item = localStorage.getItem('adminData');
    const data = item && JSON.parse(item);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Bearer: data.token,
        'User-ID': data.id,
      }),
    };
    return httpOptions;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub?.unsubscribe();
    }
  }
}
