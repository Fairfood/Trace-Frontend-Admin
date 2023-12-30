/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { dateFormatterFF, successFormatter } from '../core/utils/app.config';
import { DashboardService } from './dashboard/dashboard.service';
import { previousStartDate } from './dashboard/dashboard.config';
const BASE_URL = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  getCompanyList(appliedFilters: any): Observable<any> {
    const {
      limit,
      offset,
      searchString,
      status,
      selectedSupplyChain,
      selectedCountry,
      sortBy,
      orderBy,
    } = appliedFilters;
    const sortUrl = `&sort_by=${sortBy}&order_by=${orderBy}`;
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/companies/?search=' +
          searchString +
          '&supply_chain=' +
          selectedSupplyChain +
          '&status=' +
          status +
          '&limit=' +
          limit +
          '&offset=' +
          offset +
          '&country=' +
          selectedCountry +
          sortUrl,

        this.options()
      )
      .pipe(map(successFormatter));
  }

  getsupplyChainList(
    val: string,
    limit: number,
    offset: number
  ): Observable<any> {
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/supplychain/?search=' +
          val +
          '&limit=' +
          limit +
          '&offset=' +
          offset,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  getFarmersList(filterValues: any): Observable<any> {
    const {
      searchString,
      selectedCountry,
      selectedSupplyChain,
      offset,
      limit,
      sortBy,
      orderBy,
    } = filterValues;
    const sortUrl = `&sort_by=${sortBy}&order_by=${orderBy}`;
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/farmers/?search=' +
          searchString +
          '&limit=' +
          limit +
          '&offset=' +
          offset +
          '&supply_chain=' +
          selectedSupplyChain +
          '&country=' +
          selectedCountry +
          sortUrl,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  getFarmerProfile(farmerId: string): Observable<any> {
    return this.http
      .get(
        `${BASE_URL}/supply-chain/admin/farmers/${farmerId}/`,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  getTransactionList(filterValues: any): Observable<any> {
    const {
      searchString,
      offset,
      limit,
      selectedSupplyChain,
      orderBy,
      sortBy,
    } = filterValues;
    const sortUrl = `&sort_by=${sortBy}&order_by=${orderBy}`;
    return this.http
      .get(
        BASE_URL +
          '/transactions/admin/external-transactions/?search=' +
          searchString +
          '&limit=' +
          limit +
          '&offset=' +
          offset +
          '&supply_chain=' +
          selectedSupplyChain +
          sortUrl,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  getCountryList(): Observable<any> {
    return this.http
      .get(BASE_URL + '/supply-chain/countries/', this.options())
      .pipe(
        map((result: any) => {
          const { data } = result;
          return data;
        })
      );
  }

  statisticsData(supplyChain = ''): Observable<any> {
    return this.http
      .get(
        BASE_URL + '/transactions/admin/stats/?supply_chain=' + supplyChain,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  companyGraphData(): Observable<any> {
    const startDate = previousStartDate(12);
    const endDate = previousStartDate(0);
    return this.dashboardService.actorReportData(
      'quarter',
      startDate,
      endDate,
      '',
      ''
    );
  }

  transactionGraphData(): Observable<any> {
    const startDate = previousStartDate(12);
    const endDate = previousStartDate(0);
    return this.dashboardService.actorTransactionReportData(
      'quarter',
      startDate,
      endDate,
      '',
      ''
    );
  }

  genericGraphData(inputArray: any[], key: string, title: string): any[] {
    const result = [];
    const series = [];
    for (let index = 0; index < inputArray.length; index++) {
      const element = inputArray[index];
      series.push({
        name: dateFormatterFF(element.grouped_by),
        value: element[key],
      });
    }

    result.push({
      name: title,
      series: series,
    });
    return result;
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
