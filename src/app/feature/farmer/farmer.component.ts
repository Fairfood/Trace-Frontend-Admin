/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { CompanyProfileService } from 'src/app/feature/company-profile/company-profile.service';
// services and configs
import {
  exportFileType,
  exportType,
  FARMER_COLUMNS,
  SEARCHBY_OPTIONS,
  TableColumnHeader,
} from 'src/app/core/utils/app.constants';
import { FeatureService } from '../feature.service';
import { Router } from '@angular/router';
import { nFormatter } from 'src/app/core/utils/app.config';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styleUrls: ['./farmer.component.scss'],
})
export class FarmerComponent implements OnInit, OnDestroy {
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: TableColumnHeader[] = FARMER_COLUMNS;
  totalCount: any;
  appliedFilters: any;
  searchBy: any[] = SEARCHBY_OPTIONS;
  toggleFilter: boolean;
  loading = true;
  supplyChainList: any;
  countryList: any[];
  farmerStatistics: any;
  formattedChart: any;

  constructor(
    private featureService: FeatureService,
    private dataService: DataService,
    private cService: CompanyProfileService,
    private router: Router
  ) {
    this.resetFilter();
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.getSupplyChains();
  }

  loadFarmer(): void {
    this.loading = true;
    this.farmerList();
  }

  getSupplyChains(): void {
    const api = this.dataService
      .fetchAllSupplyChains('')
      .subscribe((res: any) => {
        this.supplyChainList = res;
        this.getCountries();
      });

    this.pageApis.push(api);
  }

  getCountries(): void {
    const api = this.featureService.getCountryList().subscribe((res: any) => {
      const formatedData = this.cService.formatCountries(res);
      this.countryList = formatedData.countries;
      this.homeStatistics();
      this.farmerList();
    });

    this.pageApis.push(api);
  }

  farmerList(): void {
    this.dataSource = [];
    const api = this.featureService
      .getFarmersList(this.appliedFilters)
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
    this.loadFarmer();
  }

  searchFilter(data: any): void {
    this.appliedFilters.searchString = data;
    this.appliedFilters.limit = 10;
    this.appliedFilters.offset = 0;
    this.loadFarmer();
  }

  filterClicked(): void {
    this.toggleFilter = !this.toggleFilter;
    if (!this.toggleFilter) {
      this.resetFilter();
      this.loadFarmer();
    }
  }

  otherFilters(data: any, type: string): void {
    const selected = data.id === 'All' ? '' : data.id;
    if (type === 'supply') {
      this.appliedFilters.selectedSupplyChain = selected;
    } else {
      this.appliedFilters.selectedCountry = selected;
    }
    this.loadFarmer();
  }

  resetFilter(): void {
    this.appliedFilters = {
      limit: 10,
      offset: 0,
      searchString: '',
      selectedCountry: '',
      selectedSupplyChain: '',
      sortBy: 'created_on',
      orderBy: 'desc',
    };
  }

  viewDetails(id: any): void {
    this.router.navigateByUrl('/farmer-profile/' + id);
  }

  sortData(column: string): void {
    let sortByColumn = '';
    switch (column) {
      case 'created_on':
        sortByColumn = 'created_on';
        break;
      case 'country':
        sortByColumn = 'country';
        break;
      // case 'name':
      //   sortByColumn = 'company.name';
      //   break;
      default:
        sortByColumn = 'created_on';
        break;
    }
    if (this.appliedFilters.sortBy === sortByColumn) {
      this.appliedFilters.orderBy =
        this.appliedFilters.orderBy === 'asc' ? 'desc' : 'asc';
    } else {
      this.appliedFilters.orderBy = 'asc';
    }
    this.appliedFilters.sortBy = sortByColumn;

    this.loadFarmer();
  }

  initExport(): void {
    const { searchString, status, selectedSupplyChain, selectedCountry } =
      this.appliedFilters;
    const params = {
      search: searchString,
      status,
      supply_chain: selectedSupplyChain,
      country: selectedCountry,
    };
    this.dataService.initExportData({
      export_type: exportType.ADMIN_FARMER,
      filters: JSON.stringify(params),
      file_type: exportFileType.EXCEL,
    });
  }

  homeStatistics(): void {
    const api = this.featureService.statisticsData().subscribe(
      result => {
        const { farmers, farmer_transaction_quantity, farmer_transactions } =
          result;
        this.farmerStatistics = {
          farmers: {
            title: farmers,
            value: nFormatter(farmers),
          },
          totalQty: {
            title: farmer_transaction_quantity,
            value: nFormatter(farmer_transaction_quantity),
          },
          transactions: {
            title: farmer_transactions,
            value: nFormatter(farmer_transactions),
          },
        };
        this.actorReportData();
      },
      () => {
        this.farmerStatistics = null;
        this.actorReportData();
      }
    );
    this.pageApis.push(api);
  }

  actorReportData(): void {
    const api = this.featureService
      .companyGraphData()
      .subscribe((result: any) => {
        let actorData = [];
        if (result.length) {
          actorData = this.featureService.genericGraphData(
            result,
            'farmer_count',
            'Farmers'
          );
        }

        this.formattedChart = actorData;
      });
    this.pageApis.push(api);
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
