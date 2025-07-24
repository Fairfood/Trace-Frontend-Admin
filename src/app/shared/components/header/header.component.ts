/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

// services
import { AuthService } from 'src/app/shared/services';
import { DataService } from 'src/app/shared/services/data.service';
import { DashboardService } from 'src/app/feature/dashboard/dashboard.service';
// config
import {
  YearObj,
  YEAR_DROPDOWN,
} from 'src/app/feature/dashboard/dashboard.config';
// components
import { DownloadsComponent } from 'src/app/shared/components/downloads';
import { FairFoodDropdownComponent } from '../ff-dropdown';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    DownloadsComponent,
    MatMenuModule,
    FairFoodDropdownComponent,
    MatIconModule,
    TranslateModule,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly router = inject(Router);
  readonly dataService = inject(DataService);
  readonly authService = inject(AuthService);
  readonly dashboardService = inject(DashboardService);

  private destroy$ = new Subject<void>();

  pushRightClass = '';
  userData: any;
  // selected supply chain
  selectedSupplyChain = 'All';
  allSupplyChain = true;
  loading = true;
  supplyChainLoading = true;

  supplychainDropdownSub: any;
  brandLogo: any;
  supplyChainList: any[] = [];
  hideDropDown: boolean;
  actorFilters: any;
  currentProducts: any;
  yearDropDown = YEAR_DROPDOWN;
  selectedCommodity: any = '';
  constructor() {
    this.dataService.loadGoogleMaps();
  }

  ngOnInit(): void {
    this.pushRightClass = 'push-right';
    this.actorFilters = {
      currentYearFilter: YEAR_DROPDOWN[1],
    };

    this.getUserData();

    this.dataService.hideSupplyChain
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res === 'show') {
          // this.selectedSupplyChain = 'All';
          this.supplyChainLoading = true;
          this.getSupplyChains();
          this.hideDropDown = false;
        } else {
          this.supplyChainLoading = false;
          this.hideDropDown = true;
        }
      });
  }

  getUserData(): void {
    this.userData = this.authService.getUserData();
    this.loading = false;
  }

  getSupplyChains(): void {
    this.dataService
      .fetchAllSupplyChains('')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loading = false;
        this.supplyChainList = res;
        this.fetchProductsInSupplyChain();
      });
  }

  fetchProductsInSupplyChain(): void {
    const supply =
      this.selectedSupplyChain === 'All' ? '' : this.selectedSupplyChain;
    this.dashboardService
      .fetchProducts(supply)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.currentProducts = result.results;
          this.supplyChainLoading = false;
        },
        error: () => {
          this.currentProducts = [];
          this.supplyChainLoading = false;
        },
      });
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
    this.authService.logoutWithoutApi();
  }

  filterSupplyChain(data: any): void {
    const selectedValue = data?.id === 'All' ? '' : data.id;
    if (this.selectedSupplyChain !== selectedValue) {
      this.selectedCommodity = '';
      this.selectedSupplyChain = selectedValue;
      this.fetchProductsInSupplyChain();
      this.dataService.supplyChainDataChanged.next({
        type: 'supplyChain',
        value: selectedValue,
      });
    }
  }

  menuItemSelected(data: any): void {
    const selectedValue = data?.id === 'All' ? '' : data.id;
    if (this.selectedCommodity !== selectedValue) {
      this.selectedCommodity = selectedValue;
      this.dataService.supplyChainDataChanged.next({
        type: 'commodity',
        value: selectedValue,
      });
    }
  }

  yearFilterCommon(item: YearObj): void {
    this.actorFilters.currentYearFilter = item;
    this.dataService.supplyChainDataChanged.next({
      type: 'year',
      value: item,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
