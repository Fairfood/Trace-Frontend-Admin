/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { successFormatter } from 'src/app/core/utils/app.config';
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
        this.options()
      )
      .pipe(map(successFormatter));
  }

  createNewUser(params: any): Observable<any> {
    return this.http
      .post(BASE_URL + '/accounts/admin/admin-users/', params, this.options())
      .pipe(map(successFormatter));
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
