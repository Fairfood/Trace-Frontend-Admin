/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  TableColumnHeader,
  PROFILE_SUPPLY_CHAIN_COLUMNS,
} from 'src/app/core/utils/app.constants';
import { AddSupplyChainComponent } from '../add-supply-chain/add-supply-chain.component';
import { CompanyProfileService } from '../company-profile.service';

@Component({
  selector: 'app-active-supply-chain',
  templateUrl: './active-supply-chain.component.html',
  styleUrls: ['./active-supply-chain.component.scss'],
})
export class ActiveSupplyChainComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: TableColumnHeader[] = PROFILE_SUPPLY_CHAIN_COLUMNS;
  totalCount: any;
  filters: any = {
    limit: 10,
    offset: 0,
  };
  loading = true;

  constructor(
    private cService: CompanyProfileService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activeSupplychain();
  }

  activeSupplychain(): void {
    const { limit, offset } = this.filters;
    const api = this.cService
      .getActiveSupplyChains(this.companyId, offset, limit)
      .subscribe(
        result => {
          const { results, count } = result;
          this.totalCount = count;
          this.dataSource = results;
          this.loading = false;
        },
        () => {
          this.dataSource = [];
          this.loading = false;
        }
      );
    this.pageApis.push(api);
  }

  paginatorEvent(data: any): void {
    const { limit, offset } = data;
    this.filters.limit = limit;
    this.filters.offset = offset;
    this.loading = true;
    this.activeSupplychain();
  }

  addSupplychain(): void {
    const dialogRef = this.dialog.open(AddSupplyChainComponent, {
      width: '50vw',
      height: 'auto',
      panelClass: 'custom-modalbox',
      data: {
        id: this.companyId,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loading = true;
        this.activeSupplychain();
      }
    });
  }

  ngOnDestroy(): void {
    this.pageApis.map(m => m.unsubscribe());
  }
}
