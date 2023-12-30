/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/authentication/services/auth/auth.service';
import { DataService } from 'src/app/core/data.service';
import { DashboardService } from 'src/app/feature/dashboard/dashboard.service';
import {
  YearObj,
  YEAR_DROPDOWN,
} from 'src/app/feature/dashboard/dashboard.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  pushRightClass = '';
  userData: any;
  // selected supply chain
  selectedSupplyChain = 'All';
  allSupplyChain = true;
  loading = true;
  supplyChainLoading = true;

  supplychainDropdownSub: any;
  dataServiceSubscription: any;
  brandLogo: any;
  subscription: Subscription;
  supplyChainList: any[] = [];
  hideDropDown: boolean;
  hideChainSub: Subscription;
  supplychainApi: Subscription;
  actorFilters: any;
  currentProducts: any;
  pageApis: Subscription[] = [];
  yearDropDown = YEAR_DROPDOWN;
  selectedCommodity: any;

  constructor(
    public router: Router,
    private _dataService: DataService,
    private _authService: AuthService,
    private dashboardService: DashboardService
  ) {
    this.selectedCommodity = '';
  }

  ngOnInit(): void {
    this.pushRightClass = 'push-right';
    this.getUser();
    this.actorFilters = {
      currentYearFilter: YEAR_DROPDOWN[1],
    };

    const api = this._dataService.hideSupplyChain.subscribe(res => {
      if (res === 'show') {
        this.selectedSupplyChain = 'All';
        this.supplyChainLoading = true;
        this.getSupplyChains();
        this.hideDropDown = false;
      } else {
        this.hideDropDown = true;
      }
    });
    this.pageApis.push(api);
  }

  getUser() {
    const item = localStorage.getItem('adminData');
    const userId = item && JSON.parse(item)?.id;
    const api = this._dataService
      .getUserDetails(userId)
      .subscribe((response: any) => {
        this.userData = response.data;
        this.loading = false;
        this.supplyChainLoading = true;
        this.getSupplyChains();
      });

    this.pageApis.push(api);
  }

  getSupplyChains(): void {
    const api = this._dataService
      .fetchAllSupplyChains('')
      .subscribe((res: any) => {
        this.supplyChainList = res;
        this.fetchProductsInSupplyChain();
      });

    this.pageApis.push(api);
  }

  fetchProductsInSupplyChain(): void {
    const supply =
      this.selectedSupplyChain === 'All' ? '' : this.selectedSupplyChain;
    const api = this.dashboardService.fetchProducts(supply).subscribe(
      (result: any) => {
        this.currentProducts = result.results;
        this.supplyChainLoading = false;
      },
      () => {
        this.currentProducts = [];
        this.supplyChainLoading = false;
      }
    );
    this.pageApis.push(api);
  }

  // Function to toggle side bar
  isToggled(): void {
    // const dom: Element = document.querySelector('body');
    // return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  gotoHome() {
    this.router.navigateByUrl('/dashboard');
  }

  onLoggedout() {
    this._authService.logout();
  }

  filterSupplyChain(data: any): void {
    const selectedValue = data?.id === 'All' ? '' : data.id;
    if (this.selectedSupplyChain !== selectedValue) {
      this.selectedCommodity = '';
      this.selectedSupplyChain = selectedValue;
      this.fetchProductsInSupplyChain();
      this._dataService.supplyChainDataChanged.next({
        type: 'supplyChain',
        value: selectedValue,
      });
    }
  }

  menuItemSelected(data: any): void {
    const selectedValue = data?.id === 'All' ? '' : data.id;
    if (this.selectedCommodity !== selectedValue) {
      this.selectedCommodity = selectedValue;
      this._dataService.supplyChainDataChanged.next({
        type: 'commodity',
        value: selectedValue,
      });
    }
  }

  yearFilterCommon(item: YearObj): void {
    this.actorFilters.currentYearFilter = item;
    this._dataService.supplyChainDataChanged.next({
      type: 'year',
      value: item,
    });
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
