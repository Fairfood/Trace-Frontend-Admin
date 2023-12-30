/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { IReference } from '../farmer-profile.config';
import { FarmerProfileService } from '../farmer-profile.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() farmerId: string;
  sub: Subscription;
  activities: IReference;

  constructor(private service: FarmerProfileService) {
    this.activities = {
      count: 0,
      results: [],
      loading: true,
    };
  }

  ngOnInit(): void {
    this.farmerActivities();
  }

  farmerActivities(limit = 10, offset = 0): void {
    this.sub = this.service
      .farmerActivities(this.farmerId, limit, offset)
      .subscribe({
        next: (res: IReference) => {
          this.activities = res;
        },
      });
  }

  paginatorEvent(data: any): void {
    const { limit, offset } = data;
    this.farmerActivities(limit, offset);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
