/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
// services and configs
import {
  COMPANY_COLUMNS,
  exportFileType,
  exportType,
  SEARCHBY_OPTIONS,
  TableColumnHeader,
} from 'src/app/shared/configs/app.constants';
import { IMPORTS_COMPANY } from './company.config';
import { nFormatter } from 'src/app/shared/configs/app.config';

// services
import { CompanyProfileService } from '../company-profile/company-profile.service';
import { DataService } from 'src/app/shared/services';

import { FeatureService } from '../feature.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  standalone: true,
  imports: IMPORTS_COMPANY,
})
export class CompanyComponent implements OnInit, OnDestroy {
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: TableColumnHeader[] = COMPANY_COLUMNS;
  totalCount: any;
  appliedFilters: any;
  searchBy: any[] = SEARCHBY_OPTIONS;
  toggleFilter: boolean;
  loading = true;
  statusFilterMaster = [
    {
      id: '1',
      name: 'Active',
    },
    {
      id: '2',
      name: 'Inactive',
    },
    {
      id: '3',
      name: 'Blocked',
    },
  ];

  supplyChainList: any[];
  selectedSupplyChain: string;
  invite: boolean;
  countryList: any[];
  companyStatistics: any;
  actorColors: string[];
  formattedChart: any;
  filters: any;
  customPageSize: { limit: any; offset: any };
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private featureService: FeatureService,
    private dataService: DataService,
    private router: Router,
    private cService: CompanyProfileService
  ) {
    this.cService.paginationState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {
        this.filters = state;
        this.toggleFilter = !!(
          this.filters.selectedCountry ||
          this.filters.selectedSupplyChain ||
          this.filters.status
        );
        this.resetFilter();
      });
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.loading = true;
    this.getSupplyChains();
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(event => {
      if (event instanceof NavigationStart) {
        const nextRoute = event.url;
        if (
          nextRoute !== '/company' &&
          !nextRoute.startsWith('/company-profile/')
        ) {
          this.cService.resetPaginationState();
        }
      }
    });
  }

  resetFilter(): void {
    this.appliedFilters = this.filters;
    this.customPageSize = {
      limit: this.appliedFilters?.limit,
      offset: this.appliedFilters?.offset,
    };
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyList();
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
      this.companyList();
    });

    this.pageApis.push(api);
  }

  companyList(): void {
    this.dataSource = [];
    const api = this.featureService
      .getCompanyList(this.appliedFilters)
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
    this.customPageSize = {
      limit: this.appliedFilters?.limit,
      offset: this.appliedFilters?.offset,
    };
    this.loadCompanies();
  }

  searchFilter(data: any): void {
    this.appliedFilters.searchString = data;
    this.appliedFilters.limit = 10;
    this.appliedFilters.offset = 0;
    this.loadCompanies();
  }

  otherFilters(data: any, type: string): void {
    const selected = data.id === 'All' ? '' : data.id;

    if (type === 'supply') {
      this.appliedFilters.selectedSupplyChain = selected;
    } else if (type === 'country') {
      this.appliedFilters.selectedCountry = selected;
    } else {
      this.appliedFilters.status = selected;
    }
    this.customPageSize = {
      limit: this.appliedFilters?.limit,
      offset: 0,
    };
    this.loadCompanies();
  }

  filterClicked(): void {
    this.toggleFilter = !this.toggleFilter;
    if (!this.toggleFilter) {
      this.cService.resetPaginationState();
      this.loadCompanies();
    }
  }

  viewDetails(id: string): void {
    this.cService.setPaginationState(this.appliedFilters);
    this.router.navigateByUrl('/company-profile/' + id);
  }

  inviteCompany(data?: any): void {
    this.invite = !this.invite;
    if (data && data === 'reload') {
      this.toggleFilter = false;
      this.cService.resetPaginationState();
      this.loadCompanies();
    } else {
      this.toggleFilter = false;
      this.cService.resetPaginationState();
      this.loadCompanies();
    }
  }

  sortData(column: string): void {
    let sortByColumn = '';
    switch (column) {
      case 'created_on':
        sortByColumn = 'created_on';
        break;
      case 'status':
        sortByColumn = 'status';
        break;
      case 'country':
        sortByColumn = 'country';
        break;
      case 'name':
        sortByColumn = 'name';
        break;
      case 'supplyChain':
        sortByColumn = 'supplyChain';
        break;
      case 'farmer':
        sortByColumn = 'farmer';
        break;
      case 'transaction':
        sortByColumn = 'transaction';
        break;
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

    this.loadCompanies();
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
      export_type: exportType.ADMIN_COMPANY,
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
        const { companies, active_companies, transactions } = result;
        this.companyStatistics = {
          companies: {
            title: companies,
            value: nFormatter(companies),
          },
          activeCompanies: {
            title: active_companies,
            value: nFormatter(active_companies),
          },
          transactions: {
            title: transactions,
            value: nFormatter(transactions),
          },
        };
        this.actorReportData();
      },
      () => {
        this.companyStatistics = null;
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
            'company_count',
            'Companies'
          );
        }

        this.formattedChart = actorData;
        this.actorColors = ['#5691AE', '#003A60'];
      });
    this.pageApis.push(api);
  }

  navigateToDashboard(data: any): void {
    this.cService.viewingAsAdmin(data);
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
