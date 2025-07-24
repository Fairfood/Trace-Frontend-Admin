/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { successFormatter } from 'src/app/shared/configs/app.config';
import { headerOptions, HTTP_OPTION_1 } from 'fairfood-utils';
import { StorageService } from 'src/app/shared/services';

const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class CompanyProfileService {
  readonly http = inject(HttpClient);
  readonly router = inject(Router);
  readonly storage = inject(StorageService);
  private initialState = {
    status: '',
    limit: 10,
    offset: 0,
    searchString: '',
    selectedCountry: '',
    selectedSupplyChain: '',
    sortBy: 'created_on',
    orderBy: 'desc',
  };

  private paginationState = new BehaviorSubject<any>({ ...this.initialState });

  paginationState$ = this.paginationState.asObservable(); // Observable for components to subscribe

  setPaginationState(newState: any) {
    this.paginationState.next(newState);
  }

  /** Reset pagination state to initial values */
  resetPaginationState() {
    this.paginationState.next({ ...this.initialState });
  }

  getCompanyDetails(id: string): Observable<any> {
    return this.http
      .get(
        BASE_URL + '/supply-chain/admin/company/' + id + '/',
        headerOptions(HTTP_OPTION_1)
      )
      .pipe(map(successFormatter));
  }

  inviteCompany(params: any): Observable<any> {
    return this.http.post(
      BASE_URL + '/supply-chain/admin/invite/company/',
      params,
      headerOptions(HTTP_OPTION_1)
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
        headerOptions(HTTP_OPTION_1)
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
        headerOptions(HTTP_OPTION_1)
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
      headerOptions(HTTP_OPTION_1)
    );
  }

  addActiveSupplyChains(id: string, params: any): Observable<any> {
    return this.http.post(
      BASE_URL + '/supply-chain/admin/node-supplychain/' + id + '/',
      params,
      headerOptions(HTTP_OPTION_1)
    );
  }

  supplychainListForCompanies(nodeId: any): Observable<any> {
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/supplychain/?search=&limit=500&exclude_node=' +
          nodeId,
        headerOptions(HTTP_OPTION_1)
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
    const item = this.storage.retrieveStoredData('adminData');
    const adminData = JSON.parse(item);
    const id_token = this.storage.retrieveStoredData('id_token');

    this.storage.saveInStorage('viewingAsAdmin', 'true');
    this.storage.saveInStorage('redirectUrl', this.router.url);
    const localData: any = {
      nodeId: id,
      name,
      ...adminData,
      id_token,
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
        headerOptions(HTTP_OPTION_1)
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

  /**
   * The function `syncWithNavigate` sends a POST request to a specific URL with provided parameters
   * and header options.
   **/
  syncWithNavigate(params: any): Observable<any> {
    return this.http.post(
      BASE_URL + '/projects/navigate-sync/',
      params,
      headerOptions(HTTP_OPTION_1)
    );
  }

  searchCompanyProxy(params: any): Observable<any> {
    return this.http.post(
      BASE_URL + '/supply-chain/validate/company-name/',
      params,
      headerOptions(HTTP_OPTION_1)
    );
  }
}
