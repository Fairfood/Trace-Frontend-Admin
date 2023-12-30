/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
// services and configs
import {
  ACTION_TYPE,
  CLAIM_COLUMNS,
  SEARCHBY_OPTIONS,
  TableColumnHeader,
} from 'src/app/core/utils/app.constants';
import { STATUS_FILTER, TYPE_FILTER } from './claim.config';
import { ClaimService } from './claim.service';
import { EditClaimComponent } from './edit-claim/edit-claim.component';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss'],
})
export class ClaimComponent implements OnInit, OnDestroy {
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: TableColumnHeader[] = CLAIM_COLUMNS;
  totalCount: any;
  appliedFilters: any;
  loading: boolean;
  searchBy: any[] = SEARCHBY_OPTIONS;
  create: boolean;
  toggleFilter: boolean;

  statusFilter = STATUS_FILTER;
  typeFilter = TYPE_FILTER;
  supplyChainList: any;

  constructor(
    private claimService: ClaimService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
    this.appliedFilters = {
      status: '',
      limit: 10,
      offset: 0,
      searchString: '',
      type: '',
      selectedSupplyChain: '',
    };
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.loading = true;
    this.getSupplyChains();
  }

  getSupplyChains(): void {
    const api = this.dataService
      .fetchAllSupplyChains('')
      .subscribe((res: any) => {
        this.supplyChainList = res;
        this.loadClaims();
      });

    this.pageApis.push(api);
  }

  loadClaims(): void {
    this.loading = true;
    this.claimList();
  }

  claimList(): void {
    this.dataSource = [];
    const api = this.claimService.getClaimsList(this.appliedFilters).subscribe(
      result => {
        const { results, count } = result;

        this.totalCount = count;
        this.dataSource = results.map((s: any) => {
          return {
            ...s,
            supplyNames: s.supply_chains?.map((m: any) => m.name),
          };
        });
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
    this.appliedFilters.limit = limit;
    this.appliedFilters.offset = offset;
    this.loadClaims();
  }

  searchFilter(data: any): void {
    this.appliedFilters.searchString = data;
    this.resetFilter();
  }

  toggleCreateClaim(event?: string): void {
    this.create = !this.create;
    this.appliedFilters = {
      status: '',
      limit: 10,
      offset: 0,
      searchString: '',
      type: '',
      selectedSupplyChain: '',
    };
    this.loadClaims();
  }

  resetFilter(): void {
    this.appliedFilters.limit = 10;
    this.appliedFilters.offset = 0;
    this.loadClaims();
  }

  filterClicked(): void {
    this.toggleFilter = !this.toggleFilter;
    if (!this.toggleFilter) {
      this.appliedFilters = {
        status: '',
        limit: 10,
        offset: 0,
        searchString: '',
        type: '',
        selectedSupplyChain: '',
      };
      this.loadClaims();
    }
  }

  otherFilters(data: any, type: string): void {
    const selected = data.id === 'All' ? '' : data.id;

    if (type === 'status') {
      this.appliedFilters.status = selected;
    } else if (type === 'supply') {
      this.appliedFilters.selectedSupplyChain = selected;
    } else {
      this.appliedFilters.type = selected;
    }

    this.resetFilter();
  }

  disableClaim(data: any) {
    const params = { active: !data.active };
    const api = this.claimService
      .updateClaim(data.id, params)
      .subscribe((res: any) => {
        if (res?.success) {
          if (res.data.active) {
            const message = res.data.name + ' claim has been enabled';
            this.dataService.customSnackBar(message, ACTION_TYPE.SUCCESS);
          } else {
            const message = res.data.name + ' claim has been disabled';
            this.dataService.customSnackBar(message, ACTION_TYPE.SUCCESS);
          }
          this.appliedFilters.status = '';
          this.appliedFilters.type = '';
          this.appliedFilters.searchString = '';
          this.resetFilter();
        } else {
          const message = 'Failed to update claim details';
          this.dataService.customSnackBar(message, ACTION_TYPE.FAILED);
        }
      });
    this.pageApis.push(api);
  }

  editClaim(item: any): void {
    const dialogRef = this.dialog.open(EditClaimComponent, {
      disableClose: true,
      minWidth: '50vw',
      height: 'auto',
      panelClass: 'custom-modalbox',
      data: {
        supplyChainData: this.supplyChainList,
        claimData: item,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadClaims();
      }
    });
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
