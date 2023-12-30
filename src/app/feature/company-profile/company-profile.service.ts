/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { successFormatter } from 'src/app/core/utils/app.config';
const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class CompanyProfileService {
  constructor(public http: HttpClient, private router: Router) {}

  getCompanyDetails(id: string): Observable<any> {
    return this.http
      .get(BASE_URL + '/supply-chain/admin/company/' + id + '/', this.options())
      .pipe(map(successFormatter));
  }

  inviteCompany(params: any): Observable<any> {
    return this.http.post(
      BASE_URL + '/supply-chain/admin/invite/company/',
      params,
      this.options()
    );
  }

  formatCountries(data: any): any {
    const countryCodes: { id: string; name: string }[] = [];
    const result = Object.keys(data).map(key => {
      data[key].id = key;
      data[key].name = key;
      countryCodes.push({
        id: `+${data[key].dial_code}`,
        name: `${key} (+${data[key].dial_code})`,
      });
      return data[key];
    });

    return {
      countries: result,
      codes: countryCodes,
    };
  }

  listTeamOfCompany(
    id: string,
    offset: number,
    limit: number
  ): Observable<any> {
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/company/' +
          id +
          '/member/?limit=' +
          limit +
          '&offset=' +
          offset,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  getActiveSupplyChains(
    id: string,
    offset: number,
    limit: number
  ): Observable<any> {
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/supplychain/node/' +
          id +
          '/?limit=' +
          limit +
          '&offset=' +
          offset,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  activityLog(id: string, offset: number, limit: number): Observable<any> {
    return this.http.get(
      BASE_URL +
        '/supply-chain/admin/company/activity/' +
        id +
        '/?limit=' +
        limit +
        '&offset=' +
        offset,
      this.options()
    );
  }

  addActiveSupplyChains(id: string, params: any): Observable<any> {
    return this.http.post(
      BASE_URL + '/supply-chain/admin/node-supplychain/' + id + '/',
      params,
      this.options()
    );
  }

  supplychainListForCompanies(nodeId: any): Observable<any> {
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/supplychain/?search=&limit=500&exclude_node=' +
          nodeId,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  viewingAsAdmin(data: any): void {
    const { id, name } = data;
    document.cookie.split(';').forEach(function (c) {
      document.cookie =
        c.trim().split('=')[0] +
        '=;' +
        'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    });
    const item = localStorage.getItem('adminData');
    const adminData = JSON.parse(item);

    localStorage.setItem('viewingAsAdmin', 'true');
    localStorage.setItem('redirectUrl', this.router.url);
    const localData: any = {
      nodeId: id,
      name,
      ...adminData,
    };
    let domainPath = '';

    if (environment.traceUrl.includes('.org')) {
      domainPath = 'domain=fairfood.org;';
    } else if (environment.traceUrl.includes('localhost')) {
      domainPath = '';
    } else {
      domainPath = 'domain=fairfood.nl;';
    }
    document.cookie = `userData=${JSON.stringify(
      localData
    )};${domainPath}path=/`;
    window.location.href = environment.traceUrl;
  }

  addThemeablilty(id: string, params: any): Observable<any> {
    return this.http
      .post(
        BASE_URL + '/supply-chain/admin/theme/node/' + id + '/',
        params,
        this.options()
      )
      .pipe(
        map((res: any) => {
          const { code, data } = res;
          if (code === 201) {
            return data;
          } else {
            return res;
          }
        })
      );
  }

  // httpOptions
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
}
