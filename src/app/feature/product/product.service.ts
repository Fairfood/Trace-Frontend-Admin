/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { headerOptions, HTTP_OPTION_1, HTTP_OPTION_2 } from 'fairfood-utils';
const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductList(
    searchString: string,
    offset: number,
    limit: number,
    supplyChain: string
  ): Observable<any> {
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/products/?supply_chain=' +
          supplyChain +
          '&search=' +
          searchString +
          '&limit=' +
          limit +
          '&offset=' +
          offset,
        headerOptions(HTTP_OPTION_1)
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

  createProduct(params: any): Observable<any> {
    const { req, isEdit, id } = params;
    let url = BASE_URL + '/supply-chain/admin/products/';
    if (isEdit) {
      url += `${id}/`;
      return this.http.patch(url, req, headerOptions(HTTP_OPTION_2));
    }
    return this.http.post(url, req, headerOptions(HTTP_OPTION_2));
  }

  options2() {
    const item = localStorage.getItem('adminData');
    const data = item && JSON.parse(item);
    const httpOptions = {
      headers: new HttpHeaders({
        Bearer: data.token,
        'User-ID': data.id,
      }),
    };
    return httpOptions;
  }
}
