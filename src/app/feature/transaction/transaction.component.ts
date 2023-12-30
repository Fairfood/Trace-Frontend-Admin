/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
// services and configs
import { DataService } from 'src/app/core/data.service';
import { nFormatter } from 'src/app/core/utils/app.config';
import {
  TRANSACTION_COLUMNS,
  SEARCHBY_OPTIONS,
  TableColumnHeader,
  exportType,
  exportFileType,
} from 'src/app/core/utils/app.constants';
import { FeatureService } from '../feature.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit, OnDestroy {
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: TableColumnHeader[] = TRANSACTION_COLUMNS;
  totalCount: any;
  appliedFilters: any;
  searchBy: any[] = SEARCHBY_OPTIONS;
  toggleFilter: boolean;
  loading = true;
  supplyChainList: any[];
  statistics: any;
  formattedChart: any;

  constructor(
    private featureService: FeatureService,
    private dataService: DataService
  ) {
    this.resetFilter();
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.getSupplyChains();
  }

  resetFilter(): void {
    this.appliedFilters = {
      limit: 10,
      offset: 0,
      searchString: '',
      selectedSupplyChain: '',
      sortBy: 'date',
      orderBy: 'desc',
    };
  }

  loadTransaction(): void {
    this.loading = true;
    this.transactionList();
  }

  getSupplyChains(): void {
    const api = this.dataService
      .fetchAllSupplyChains('')
      .subscribe((res: any) => {
        this.supplyChainList = res;
        this.loadTransaction();
        this.homeStatistics();
      });

    this.pageApis.push(api);
  }

  transactionList(): void {
    this.dataSource = [];
    const api = this.featureService
      .getTransactionList(this.appliedFilters)
      .subscribe(
        result => {
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
    this.loadTransaction();
  }

  searchFilter(data: any): void {
    this.appliedFilters.searchString = data;
    this.appliedFilters.limit = 10;
    this.appliedFilters.offset = 0;
    this.loadTransaction();
  }

  filterClicked(): void {
    this.toggleFilter = !this.toggleFilter;
    if (!this.toggleFilter) {
      this.resetFilter();
      this.loadTransaction();
    }
  }

  otherFilters(data: any): void {
    const selected = data.id === 'All' ? '' : data.id;
    this.appliedFilters.selectedSupplyChain = selected;
    this.loadTransaction();
  }

  sortData(column: string): void {
    let sortByColumn = '';
    switch (column) {
      case 'date':
        sortByColumn = 'date';
        break;
      case 'number':
        sortByColumn = 'number';
        break;
      case 'quantity':
        sortByColumn = 'quantity';
        break;
      case 'name':
        sortByColumn = 'connection.name';
        break;
      default:
        sortByColumn = 'date';
        break;
    }
    if (this.appliedFilters.sortBy === sortByColumn) {
      this.appliedFilters.orderBy =
        this.appliedFilters.orderBy === 'asc' ? 'desc' : 'asc';
    } else {
      this.appliedFilters.orderBy = 'asc';
    }
    this.appliedFilters.sortBy = sortByColumn;

    this.loadTransaction();
  }

  initExport(): void {
    const { searchString, selectedSupplyChain } = this.appliedFilters;
    const params = {
      search: searchString,
      supply_chain: selectedSupplyChain,
    };
    this.dataService.initExportData({
      export_type: exportType.ADMIN_EXTERNAL_TRANSACTION,
      filters: JSON.stringify(params),
      file_type: exportFileType.EXCEL,
    });
  }

  /**
   * Statistics like actor count farmer count etcc....
   */
  homeStatistics(): void {
    const api = this.featureService.statisticsData().subscribe(
      result => {
        const {
          transactions,
          farmer_transaction_quantity,
          farmer_transactions,
        } = result;
        this.statistics = {
          farmerTransaction: {
            title: farmer_transactions,
            value: nFormatter(farmer_transactions),
          },
          totalQty: {
            title: farmer_transaction_quantity,
            value: nFormatter(farmer_transaction_quantity),
          },
          transactions: {
            title: transactions,
            value: nFormatter(transactions),
          },
        };
        this.transactionReportData();
      },
      () => {
        this.statistics = null;
        this.transactionReportData();
      }
    );
    this.pageApis.push(api);
  }

  transactionReportData(): void {
    const api = this.featureService
      .transactionGraphData()
      .subscribe((result: any) => {
        let transactionData = [];
        if (result.length) {
          transactionData = this.featureService.genericGraphData(
            result,
            'count',
            'Transactions'
          );
        }

        this.formattedChart = transactionData;
      });
    this.pageApis.push(api);
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
