/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { IReference } from '../farmer-profile.config';
import { FarmerProfileService } from '../farmer-profile.service';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss'],
})
export class FarmComponent implements OnInit, OnDestroy {
  @Input() farmerData: any;
  farmList: any;
  pageApis: Subscription[] = [];
  plotArray: any[];
  activeId: number;
  activePlotDetails: any;
  loading = true;

  constructor(private service: FarmerProfileService) {}

  ngOnInit(): void {
    const api = this.service.getFarmerPlots(this.farmerData.id).subscribe({
      next: (res: IReference) => {
        const { loading, results } = res;
        this.farmList = [];
        this.loading = loading;
        if (!loading) {
          this.plotArray = results.map((item: any) => {
            const { name, province, country } = item;
            const desc = `${province}, ${country}`;
            this.farmList.push({
              title: name,
              description: desc,
              rightIcon: {
                isMatIcon: true,
                icon: 'keyboard_arrow_right',
              },
            });
            return {
              ...item,
              address: desc,
            };
          });
          this.plotSelected({ index: 0, item: this.farmList[0] });
        }
      },
    });
    this.pageApis.push(api);
  }

  plotSelected({ index }: any): void {
    this.activeId = index;
    this.activePlotDetails = this.plotArray[index];
  }

  ngOnDestroy(): void {
    this.pageApis.forEach(m => m.unsubscribe());
  }
}
