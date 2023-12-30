/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { successFormatter } from 'src/app/core/utils/app.config';
import { environment } from 'src/environments/environment';
import { genericFormatterChart, YearObj } from './dashboard.config';
const BASE_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(public http: HttpClient) {}

  actorReportData(
    type: string,
    startDate: string,
    endDate: string,
    product: string,
    supplyChain = ''
  ): Observable<any> {
    const url = `${BASE_URL}/supply-chain/admin/node-count/?trunc_type=${type}&start_date=${startDate}&end_date=${endDate}`;
    const url2 = `&supply_chain=${supplyChain}&product=${product}`;
    return this.http
      .get(url + url2, this.options())
      .pipe(map(successFormatter));
  }

  actorTransactionReportData(
    type: string,
    startDate: string,
    endDate: string,
    product: string,
    supplyChain = ''
  ): Observable<any> {
    const url = `${BASE_URL}/transactions/admin/external-transaction-count/?trunc_type=${type}&start_date=${startDate}&end_date=${endDate}`;
    const url2 = `&supply_chain=${supplyChain}&product=${product}`;
    return this.http
      .get(url + url2, this.options())
      .pipe(map(successFormatter));
  }

  farmerQuantityReportData(
    type: string,
    startDate: string,
    endDate: string,
    product: string,
    supplyChain = ''
  ): Observable<any> {
    const url = `${BASE_URL}/transactions/admin/external-transaction-quantity/?trunc_type=${type}&start_date=${startDate}&end_date=${endDate}`;
    const url2 = `&supply_chain=${supplyChain}&product=${product}`;
    return this.http
      .get(url + url2, this.options())
      .pipe(map(successFormatter));
  }

  /**
   * Generating graph data
   * Initially two series will be there
   * @param inputData any[]
   * @returns []
   */
  formatActorsGraphData(inputData: any[], yearFilter: YearObj): any[] {
    const { id } = yearFilter;

    const result = genericFormatterChart(
      inputData,
      ['Farmer', 'Company'],
      ['farmer_count', 'company_count'],
      id
    );

    return result;
  }

  /**
   * Generating graph data
   * Initially two series will be there
   * @param inputData any[]
   * @returns []
   */
  formatTransactionData(
    inputData: any[],
    type: string,
    yearFilter: YearObj
  ): any[] {
    const { id } = yearFilter;
    const result = genericFormatterChart(
      inputData,
      [
        type === 'count'
          ? 'Farmer transactions'
          : 'Farmer transaction quantity',
      ],
      [type],
      id
    );

    return result;
  }

  /**
   * worldMapData
   * @param supplyChainId string
   * @returns any
   */
  worldMapData(supplyChainId: string): Observable<any> {
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/country-node-count/?supply_chain=' +
          supplyChainId,
        this.options()
      )
      .pipe(map(successFormatter));
  }

  /**
   * Fetching products
   * @param supplyChainId string
   * @returns Observable
   */
  fetchProducts(supplyChainId: string): Observable<any> {
    return this.http
      .get(
        BASE_URL +
          '/supply-chain/admin/products/?limit=1000&supply_chain=' +
          supplyChainId,
        this.options()
      )
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
