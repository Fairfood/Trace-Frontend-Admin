/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { successFormatter } from '../configs/app.config';
import { HTTP_OPTION_1, headerOptions } from 'fairfood-utils';

import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

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
  readonly http = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  mapInitialized$ = new BehaviorSubject<boolean>(false);
  private initialState = {
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

  getUserDetails(param: any): Observable<any> {
    return this.http.get(
      BASE_URL + '/accounts/user/' + param + '/',
      headerOptions(HTTP_OPTION_1)
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
          headerOptions(HTTP_OPTION_1)
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
        headerOptions(HTTP_OPTION_1)
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
        .get(
          BASE_URL + '/supply-chain/countries/',
          headerOptions(HTTP_OPTION_1)
        )
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
      return this.http.patch(url, req, headerOptions(HTTP_OPTION_1));
    }
    return this.http.post(url, req, headerOptions(HTTP_OPTION_1));
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
    return this.http
      .get(BASE_URL + '/reports/exports/', headerOptions(HTTP_OPTION_1))
      .pipe(
        map((d: any) => {
          const { data } = d;
          return data.results;
        })
      );
  }

  createExport(params: any): Observable<any> {
    return this.http
      .post(
        BASE_URL + '/reports/exports/',
        params,
        headerOptions(HTTP_OPTION_1)
      )
      .pipe(
        map((d: any) => {
          const { data } = d;
          return data;
        })
      );
  }

  pingAPI(id: string): Observable<any> {
    return this.http
      .get(`${BASE_URL}/reports/exports/${id}/`, headerOptions(HTTP_OPTION_1))
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
      headerOptions(HTTP_OPTION_1)
    );
  }

  downloadReceipt(url: string): any {
    return this.http.get(url, { responseType: 'blob' });
  }

  loadGoogleMaps(): void {
    const url = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapKey}`;

    this.http
      .jsonp(url, 'callback')
      .pipe(
        map(() => true),
        catchError((err: Error) => {
          console.log(err);
          return throwError(() => false);
        }),
        tap((status: boolean) => {
          this.mapInitialized$.next(status);
        })
      )
      .subscribe();
  }
}
