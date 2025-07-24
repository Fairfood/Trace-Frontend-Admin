/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { successFormatter } from 'src/app/shared/configs/app.config';
import { headerOptions, HTTP_OPTION_1 } from 'fairfood-utils';
const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAdminUserList(filterValues: any): Observable<any> {
    const { searchString, type, offset, limit } = filterValues;
    return this.http
      .get(
        BASE_URL +
          '/accounts/admin/admin-users/?is_active=true&type=' +
          type +
          '&search=' +
          searchString +
          '&limit=' +
          limit +
          '&offset=' +
          offset,
        headerOptions(HTTP_OPTION_1)
      )
      .pipe(map(successFormatter));
  }

  createNewUser(params: any): Observable<any> {
    return this.http
      .post(
        BASE_URL + '/accounts/admin/admin-users/',
        params,
        headerOptions(HTTP_OPTION_1)
      )
      .pipe(map(successFormatter));
  }
}
