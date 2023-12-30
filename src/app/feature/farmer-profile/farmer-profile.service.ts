/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
const BASE_URL = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class FarmerProfileService {
  constructor(private http: HttpClient) {}

  getFarmerPayments(
    farmerId: string,
    search = '',
    limit = 10,
    offset = 0
  ): Observable<any> {
    return this.http
      .get(
        `${BASE_URL}/projects/projects/payments/?farmer=${farmerId}&limit=${limit}&offset=${offset}&search=${search}`,
        this.options()
      )
      .pipe(
        map((res: any) => {
          const { data, success } = res;
          if (success) {
            const { count, results } = data;
            return { count, results, loading: false };
          }
          return res;
        })
      );
  }

  farmerActivities(farmerId: string, limit = 10, offset = 0): Observable<any> {
    return this.http
      .get(
        `${BASE_URL}/activity/node/?node=${farmerId}&limit=${limit}&offset=${offset}`,
        this.options()
      )
      .pipe(
        map((res: any) => {
          const { data, success } = res;
          if (success) {
            const { count, results } = data;
            return { count, results, loading: false };
          }
          return res;
        })
      );
  }

  fetchFarmerReferences(
    farmerId: string,
    searchString?: string
  ): Observable<any> {
    return this.http
      .get(
        `${BASE_URL}/supply-chain/supply-chains/farmer-references/?farmer=${farmerId}&search=${
          searchString ?? ''
        }`,
        this.options()
      )
      .pipe(
        map((res: any) => {
          const { data, success } = res;
          if (success) {
            const { count, results } = data;
            return { count, results, loading: false };
          }
          return res;
        })
      );
  }

  getFarmerPlots(farmerId: string): Observable<any> {
    return this.http
      .get(
        `${BASE_URL}/supply-chain/supply-chains/farmer-plots/?farmer=${farmerId}`,
        this.options()
      )
      .pipe(
        map((res: any) => {
          const { data, success } = res;
          if (success) {
            const { count, results } = data;
            return { count, results, loading: false };
          }
          return res;
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
