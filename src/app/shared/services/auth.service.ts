/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Injector, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import totp from 'totp-generator';

import { HTTP_OPTION_5, HTTP_OPTION_6, headerOptions } from 'fairfood-utils';
import {
  IRefreshTokenApi,
  IdTokenRequest,
  IdTokenResponse,
} from '../configs/app.models';
import {
  clientId,
  clientSecret,
  environment,
} from 'src/environments/environment';
import { successFormatter } from '../configs/app.config';

import { StorageService } from './storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly http = inject(HttpClient);
  private readonly injector = inject(Injector);
  private readonly TOKEN_EXPIRY_THRESHOLD_MINUTES = 5;
  private jwtHelper: JwtHelperService;

  private getJwtHelper(): JwtHelperService {
    if (!this.jwtHelper) {
      this.jwtHelper = this.injector.get(JwtHelperService);
    }
    return this.jwtHelper;
  }

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
    document.cookie =
      'isFairfoodUserLoggedIn=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;';
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
    this.setCookie();
  }

  getUserData(): any {
    const data = this.storage.retrieveStoredData('adminData');
    return JSON.parse(data);
  }

  refreshToken(): Observable<any> {
    const viewingAsAdmin = this.storage.retrieveStoredData('viewingAsAdmin');
    if (viewingAsAdmin) {
      localStorage.removeItem('viewingAsAdmin');
      localStorage.removeItem('redirectUrl');
    }
    const refresh_token = this.storage.retrieveStoredData('refresh_token');
    if (!refresh_token) {
      return of();
    }
    const reqObj: IRefreshTokenApi = {
      refresh_token: refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    };
    const encoded = new URLSearchParams(Object.entries(reqObj)).toString();
    return this.http
      .post(
        `${environment.ssoBaseUrl}o/oauth2/token/`,
        encoded,
        headerOptions(HTTP_OPTION_6)
      )
      .pipe(
        catchError(() => of()),
        tap((data: any) => {
          const { access_token, refresh_token, id_token } = data;
          this.storage.saveInStorage('access_token', access_token);
          this.storage.saveInStorage('refresh_token', refresh_token);
          this.storage.saveInStorage('id_token', id_token);
          this.scheduleTokenRefresh(data.access);
        })
      );
  }

  scheduleTokenRefresh(token: string): void {
    const expirationTime = this.getJwtHelper()
      .getTokenExpirationDate(token)
      ?.getTime();
    const refreshTime = expirationTime
      ? expirationTime - this.TOKEN_EXPIRY_THRESHOLD_MINUTES * 60 * 1000
      : Date.now();
    const refreshInterval = refreshTime - Date.now();

    if (refreshInterval > 0) {
      setTimeout(() => {
        this.refreshToken().subscribe();
      }, refreshInterval);
    }
  }

  setCookie(): void {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 100);

    let domainPath = '';

    // Handle domain for local and other environments
    const currentUrl = window.location.hostname;
    if (currentUrl.includes('localhost')) {
      domainPath = 'domain=localhost;'; // Share cookies between localhost ports
    } else if (currentUrl.includes('.org')) {
      domainPath = 'domain=fairfood.org;';
    } else if (currentUrl.includes('.nl')) {
      domainPath = 'domain=fairfood.nl;';
    } else {
      const extractedDomain = currentUrl
        .split('//')[1]
        ?.split(':')[0]
        ?.split('/')[0];
      domainPath = extractedDomain ? `domain=${extractedDomain};` : '';
    }

    // Set cookie to indicate that the user is logged in
    document.cookie = `isFairfoodUserLoggedIn=true;${domainPath}path=/;expires=${expiryDate.toUTCString()};secure;`;
    console.log(document.cookie, 'Cookie');
  }
}
