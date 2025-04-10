/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  dashboardTheming: boolean;
  isUpdating: boolean;
  navigateUpdating: boolean;
  constructor(
    private route: ActivatedRoute,
    private cService: CompanyProfileService,
    private dataService: DataService
  ) {
    this.tabGroup = PROFILE_TABS;
    this.activeTabId = PROFILE_TABS[0].id;
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.companyId = this.route.snapshot.params['id'];
    this.profileData();
  }

  profileData(): void {
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
        this.dataLoaded = true;
        this.navigateUpdating = false;
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
        },
      });
    this.pageApis.push(api2);
  }

  navigateSetting(event: any): void {
    this.navigateUpdating = true;
    const params = { link_navigate: event };
    this.updateSettings(params, () => this.profileData());
  }

  ngOnDestroy(): void {
    this.pageApis.map(m => m.unsubscribe());
  }
}
