/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanyProfileService } from '../company-profile.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
  activities: any;
  isLoading = true;
  sub: Subscription;
  appliedFilters: any;

  constructor(private cService: CompanyProfileService) {}

  ngOnInit(): void {
    this.appliedFilters = {
      limit: 5,
      offset: 0,
    };
    this.logFetchApi();
  }

  logFetchApi(): void {
    this.sub = this.cService
      .activityLog(
        this.companyId,
        this.appliedFilters.offset,
        this.appliedFilters.limit
      )
      .subscribe((res: any) => {
        this.activities = res.data.results;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
