/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'src/environments/environment';
import { successFormatter } from './utils/app.config';

import { SnackBarComponent } from './components/snack-bar/snack-bar.component';

const BASE_URL = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class DataService {
  supplyChainDataChanged = new BehaviorSubject(null);
  hideSupplyChain = new BehaviorSubject(null);
  availableSupplyChains: any;
  countries: any;
  exportDataInit = new Subject<Record<string, any>>();

  constructor(public http: HttpClient, public snackBar: MatSnackBar) {}

  getUserDetails(param: any): Observable<any> {
    return this.http.get(
      BASE_URL + '/accounts/user/' + param + '/',
      this.options()
    );
  }

  fetchAllSupplyChains(searchString: any): Observable<any> {
    if (this.availableSupplyChains?.length > 0) {
      return new Observable(ob => {
        ob.next(this.availableSupplyChains);
      });
    } else {
      return this.http
        .get(
          BASE_URL +
            '/supply-chain/admin/supplychain/?search=' +
            searchString +
            '&limit=500',
          this.options()
        )
        .pipe(
          map((res: any) => {
            const { code, data } = res;

            if (code === 200) {
              this.availableSupplyChains = data.results;
              return data.results;
            }

            return res;
          })
        );
    }
  }

  getoperationsBySupplyChains(id: string): Observable<any> {
    return this.http
      .get(
        BASE_URL + '/supply-chain/operations/?supply_chain=' + id,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  getCountryList(): Observable<any> {
    if (this.countries) {
      return new Observable(ob => {
        ob.next(this.countries);
      });
    } else {
      return this.http
        .get(BASE_URL + '/supply-chain/countries/', this.options())
        .pipe(
          map((res: any) => {
            const { code, data } = res;

            if (code === 200) {
              this.countries = data;
              return data;
            }

            return res;
          })
        );
    }
  }

  createSupplyChain(params: any): Observable<any> {
    const { req, isEdit, id } = params;
    let url = BASE_URL + '/supply-chain/admin/supplychain/';
    if (isEdit) {
      url += `${id}/`;
      return this.http.patch(url, req, this.options());
    }
    return this.http.post(url, req, this.options());
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

  // Method to toast success/error messages (custom)
  customSnackBar(message: string, type: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: message,
        icon: type,
      },
      panelClass: 'snackbar-color',
      duration: 3000,
    });
  }

  initExportData(exportingParams: any): void {
    this.exportDataInit.next(exportingParams);
  }

  hasExportStarted(): Observable<Record<string, any>> {
    return this.exportDataInit.asObservable();
  }

  // export data apis
  reportListing(): Observable<any> {
    return this.http.get(BASE_URL + '/reports/exports/', this.options()).pipe(
      map((d: any) => {
        const { data } = d;
        return data.results;
      })
    );
  }

  createExport(params: any): Observable<any> {
    return this.http
      .post(BASE_URL + '/reports/exports/', params, this.options())
      .pipe(
        map((d: any) => {
          const { data } = d;
          return data;
        })
      );
  }

  pingAPI(id: string): Observable<any> {
    return this.http
      .get(`${BASE_URL}/reports/exports/${id}/`, this.options())
      .pipe(
        map((d: any) => {
          const { data } = d;
          return data;
        })
      );
  }

  cancelExport(id: string): Observable<any> {
    return this.http.post(
      `${BASE_URL}/reports/exports/${id}/revoke/`,
      {},
      this.options()
    );
  }

  downloadReceipt(url: string): any {
    return this.http.get(url, { responseType: 'blob' });
  }
}
