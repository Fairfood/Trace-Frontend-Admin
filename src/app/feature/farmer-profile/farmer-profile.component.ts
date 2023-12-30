/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeatureService } from '../feature.service';
import {
  BASIC_DETAILS,
  IReference,
  PRODUCTION_DETAILS,
  PROFILE_TABS,
} from './farmer-profile.config';
import { FarmerProfileService } from './farmer-profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-farmer-profile',
  templateUrl: './farmer-profile.component.html',
  styleUrls: ['./farmer-profile.component.scss'],
})
export class FarmerProfileComponent implements OnInit, OnDestroy {
  dataLoaded: boolean;
  farmerProfileData: any;
  activeTabId: string;
  tabGroup: any[];
  tabOne = BASIC_DETAILS;
  tabTwo = PRODUCTION_DETAILS;

  references: IReference;
  farmerReferences: any;
  activeFarmerRef: number;
  activeFarmerDetails: any;
  pageApis: Subscription[] = [];

  constructor(
    private featureService: FeatureService,
    private route: ActivatedRoute,
    private fService: FarmerProfileService
  ) {
    this.tabGroup = PROFILE_TABS;
    this.activeTabId = PROFILE_TABS[0].id;
  }

  ngOnInit(): void {
    const api = this.featureService
      .getFarmerProfile(this.route.snapshot.params['id'])
      .subscribe(result => {
        this.farmerProfileData = result;
        const splitName = result.name.split(' ');
        this.farmerProfileData.icon =
          (splitName[0].charAt(0) || '') + (splitName[1]?.charAt(0) || '');
        this.formatIncome();
        this.getReferences();
      });
    this.pageApis.push(api);
  }

  formatIncome(): void {
    const { total_income } = this.farmerProfileData;
    if (total_income && Object.keys(total_income).length) {
      const { total_amount, amount_from_products, amount_from_premiums } =
        total_income;

      const product =
        `${
          amount_from_products &&
          amount_from_products[0]?.amount.toLocaleString('en-US')
        } ${amount_from_products && amount_from_products[0]?.currency}` || 0;

      const premium =
        `${
          amount_from_premiums &&
          amount_from_premiums[0]?.amount.toLocaleString('en-US')
        } ${amount_from_premiums && amount_from_premiums[0]?.currency}` || 0;

      const total =
        `${total_amount && total_amount[0]?.amount.toLocaleString('en-US')} ${
          total_amount && total_amount[0]?.currency
        }` || 0;

      this.farmerProfileData.income = {
        product,
        premium,
        others: `0 ${total_amount && total_amount[0]?.currency}`,
        total,
      };
    } else {
      this.farmerProfileData.income = {
        product: 0,
        premium: 0,
        others: 0,
        total: 0,
      };
    }
  }

  getReferences(): void {
    const api = this.fService
      .fetchFarmerReferences(this.route.snapshot.params['id'])
      .subscribe({
        next: (res: IReference) => {
          this.references = res;
          this.activeFarmerRef = 0;
          this.activeFarmerDetails = this.references.results[0];
          this.farmerReferences = res.results?.map((item: any) => {
            const {
              reference_details: { description, name, image },
            } = item;
            return {
              title: name,
              description,
              leftIcon: {
                isMatIcon: image ? false : true,
                icon: image || 'verified_user',
              },
              rightIcon: {
                isMatIcon: true,
                icon: 'keyboard_arrow_right',
              },
            };
          });
          this.dataLoaded = true;
        },
        error: () => {
          this.dataLoaded = true;
        },
      });
    this.pageApis.push(api);
  }

  changeTab(data: any): void {
    this.activeTabId = data.id;
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
