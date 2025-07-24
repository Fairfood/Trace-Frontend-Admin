/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
// config
import { BASIC_DETAILS, PROFILE_TABS } from './company-profile.config';
// service
import { DataService } from 'src/app/shared/services/data.service';
import { CompanyProfileService } from './company-profile.service';
import { ACTION_TYPE } from 'src/app/shared/configs/app.constants';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  pageApis: Subscription[] = [];
  activeTabId: string;
  dataLoaded: boolean;
  tabGroup: any[];
  companyId: any;
  userData: any;
  companyProfileData: any;
  tabOne = BASIC_DETAILS;
  storyTheming: boolean;
  navigateEnabled = false;
  connectEnabled = false;
  dashboardTheming: boolean;
  isUpdating: boolean;
  navigateUpdating: boolean;
  connectUpdating: boolean;
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private cService: CompanyProfileService,
    private dataService: DataService,
    private router: Router
  ) {
    this.tabGroup = PROFILE_TABS;
    this.activeTabId = PROFILE_TABS[0].id;
  }

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(event => {
      if (event instanceof NavigationStart) {
        const nextRoute = event.url;
        if (
          nextRoute !== '/company' &&
          !nextRoute.startsWith('/company-profile/')
        ) {
          this.cService.resetPaginationState();
        }
      }
    });
    this.dataService.hideSupplyChain.next('hide');
    this.companyId = this.route.snapshot.params['id'];
    this.profileData();
  }

  profileData(): void {
    this.dataLoaded = false;
    const api = this.cService
      .getCompanyDetails(this.companyId)
      .subscribe((response: any) => {
        this.companyProfileData = response;
        const splitName = response.name.split(' ');
        this.companyProfileData.icon =
          (splitName[0].charAt(0) || '') + (splitName[1]?.charAt(0) || '');
        this.dashboardTheming = response.features.dashboard_theming;
        this.storyTheming = response.features.consumer_interface_theming;
        this.navigateEnabled = response?.features?.link_navigate;
        this.connectEnabled = response?.features?.link_connect;
        this.dataLoaded = true;
        this.navigateUpdating = false;
        this.connectUpdating = false;
      });
    this.pageApis.push(api);
  }

  changeTab(data: any): void {
    this.activeTabId = data.id;
  }

  navigateToDashboard(): void {
    this.cService.viewingAsAdmin(this.companyProfileData);
  }

  themeSetting(event: any, type: number): void {
    this.isUpdating = true;
    let params;
    if (type === 1) {
      params = { dashboard_theming: event.target.checked };
    } else {
      params = { consumer_interface_theming: event.target.checked };
    }
    this.updateSettings(params);
  }

  updateSettings(params: any, callback?: () => void): void {
    const api2 = this.cService
      .addThemeablilty(this.companyId, params)
      .subscribe({
        next: () => {
          this.dataService.customSnackBar(
            'Configuration updated successfully',
            ACTION_TYPE.SUCCESS
          );
          this.isUpdating = false;
          if (callback) {
            callback();
          }
        },
        error: () => {
          this.dataService.customSnackBar(
            'Something went wrong!',
            ACTION_TYPE.FAILED
          );
          this.isUpdating = false;
          if (callback) {
            callback();
          }
        },
      });
    this.pageApis.push(api2);
  }

  syncSetting(event: any, type: string): void {
    let params;
    if (type == 'navigate') {
      this.navigateUpdating = true;
      params = { link_navigate: event };
    } else {
      this.connectUpdating = true;
      params = { link_connect: event };
    }
    this.updateSettings(params, () => this.profileData());
  }

  ngOnDestroy(): void {
    this.pageApis.map(m => m.unsubscribe());
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
