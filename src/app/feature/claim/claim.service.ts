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
export class ClaimService {
  constructor(private http: HttpClient) {}

  getClaimsList(filterValues: any): Observable<any> {
    const { searchString, type, status, offset, limit, selectedSupplyChain } =
      filterValues;
    return this.http
      .get(
        BASE_URL +
          '/claims/admin/?type=' +
          type +
          '&search=' +
          searchString +
          '&active=' +
          status +
          '&limit=' +
          limit +
          '&offset=' +
          offset +
          '&supply_chain=' +
          selectedSupplyChain,
        this.options()
      )
      .pipe(
        map((res: any) => {
          const { code, data } = res;

          if (code === 200) {
            return data;
          }
        })
      );
  }

  getVerifiers(search = ''): Observable<any> {
    return this.http
      .get(
        BASE_URL + '/claims/admin/verifier/?limit=10&name=' + search,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  addClaimCriterion(reqObj: any) {
    return this.http.post(
      BASE_URL + '/claims/criterion/',
      reqObj,
      this.options()
    );
  }

  createClaim(reqObj: any) {
    return this.http.post(BASE_URL + '/claims/', reqObj, this.options());
  }

  evidenceObject(inputFormValue: any, creiteriaId: string): any[] {
    let fields: any = [];
    let params: any = {};
    inputFormValue.filter((row: any) => {
      params = {};
      const { fieldType, options, name } = row;
      if (fieldType === 2) {
        params.options = options;
      } else {
        params.options = [];
      }
      params.id = row.id;
      params.type = fieldType;
      params.title = name;
      params.criterion = creiteriaId;
      fields.push(params);
    });

    if (fields.length == 1) {
      if (fields[0].title == '') {
        fields = [];
      }
    }
    return fields;
  }

  addClaimCriterionFields(reqObj: any) {
    return this.http.post(
      BASE_URL + '/claims/criterion-field/',
      reqObj,
      this.options()
    );
  }

  updateClaim(id: string, params: any) {
    return this.http.patch(
      BASE_URL + '/claims/claim/' + id + '/',
      params,
      this.options()
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
