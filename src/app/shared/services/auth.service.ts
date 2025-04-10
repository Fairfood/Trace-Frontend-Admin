/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import totp from 'totp-generator';

import { HTTP_OPTION_5, HTTP_OPTION_6, headerOptions } from 'fairfood-utils';
import { IdTokenRequest, IdTokenResponse } from '../configs/app.models';
import { environment } from 'src/environments/environment';
import { successFormatter } from '../configs/app.config';

import { StorageService } from './storage.service';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly http = inject(HttpClient);

  forgotPassword(param: any): Observable<any> {
    return this.http.post(BASE_URL + '/accounts/password/forgot/', {
      email: param,
    });
  }

  login(params: any): Observable<any> {
    return this.http.post(BASE_URL + '/accounts/admin/login/', params);
  }

  checkPassword(params: any) {
    return this.http.post(BASE_URL + '/accounts/check/password/', params);
  }

  logoutWithoutApi(): void {
    localStorage.clear();
    window.location.href = environment.authUrl + '/logout';
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

  fetchSsoUserDetails(): Observable<any> {
    return this.http
      .get(`${BASE_URL}/accounts/current-user/`, headerOptions(HTTP_OPTION_5))
      .pipe(map(successFormatter));
  }

  /**
   * Getting id_token, access_token and refresh_token by passing code
   * @param reqObject IdTokenRequest
   * @returns Observable<any>
   */
  getIdToken(reqObject: IdTokenRequest): Observable<any> {
    const encoded = new URLSearchParams(Object.entries(reqObject)).toString();
    return this.http.post(
      `${environment.ssoBaseUrl}o/oauth2/token/`,
      encoded,
      headerOptions(HTTP_OPTION_6)
    );
  }

  setUserData(token: IdTokenResponse): void {
    this.storage.saveInStorage('isFairfoodAdminLoggedin', 'true');
    this.storage.saveInStorage('access_token', token.access_token);
    this.storage.saveInStorage('refresh_token', token.refresh_token);
    this.storage.saveInStorage('id_token', token.id_token);
  }

  getUserData(): any {
    const data = this.storage.retrieveStoredData('adminData');
    return JSON.parse(data);
  }
}
