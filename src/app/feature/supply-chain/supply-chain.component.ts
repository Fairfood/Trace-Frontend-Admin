/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

// services and configs
import {
  SEARCHBY_OPTIONS,
  SUPPLY_CHAIN_COLUMNS,
} from 'src/app/core/utils/app.constants';
import { FeatureService } from '../feature.service';
import { DataService } from 'src/app/core/data.service';
import { CreateSupplyChainComponent } from './create-supply-chain/create-supply-chain.component';

@Component({
  selector: 'app-supply-chain',
  templateUrl: './supply-chain.component.html',
  styleUrls: ['./supply-chain.component.scss'],
})
export class SupplyChainComponent implements OnInit, OnDestroy {
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: any[] = SUPPLY_CHAIN_COLUMNS;
  totalCount: any;
  appliedFilters: any;
  searchBy: any[] = SEARCHBY_OPTIONS;
  toggleFilter: boolean;
  loading = true;

  constructor(
    private featureService: FeatureService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
    this.appliedFilters = {
      limit: 10,
      offset: 0,
      searchString: '',
    };
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.supplyChainData();
  }

  supplyChainData(): void {
    this.dataSource = [];
    const { limit, offset, searchString } = this.appliedFilters;
    const api = this.featureService
      .getsupplyChainList(searchString, limit, offset)
      .subscribe(
        (result: any) => {
          const { results, count } = result;
          this.totalCount = count;
          this.dataSource = results;
          this.loading = false;
        },
        () => {
          this.dataSource = [];
          this.totalCount = 0;
          this.loading = false;
        }
      );
    this.pageApis.push(api);
  }

  paginatorEvent(data: any): void {
    const { limit, offset } = data;
    this.appliedFilters.limit = limit;
    this.appliedFilters.offset = offset;
    this.loading = true;
    this.supplyChainData();
  }

  searchFilter(data: any): void {
    this.appliedFilters.searchString = data;
    this.resetFilter();
  }

  resetFilter(): void {
    this.appliedFilters.limit = 10;
    this.appliedFilters.offset = 0;
    this.loading = true;
    this.supplyChainData();
  }

  createSupplyChain(isEdit: boolean, id?: string, name?: string): void {
    const dialogRef = this.dialog.open(CreateSupplyChainComponent, {
      disableClose: true,
      width: '427px',
      height: 'auto',
      panelClass: 'custom-modalbox',
      data: {
        isEdit: isEdit,
        id,
        name,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.resetFilter();
      }
    });
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
