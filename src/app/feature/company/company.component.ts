/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { nFormatter } from 'src/app/core/utils/app.config';
// services and configs
import {
  COMPANY_COLUMNS,
  exportFileType,
  exportType,
  SEARCHBY_OPTIONS,
  TableColumnHeader,
} from 'src/app/core/utils/app.constants';
import { CompanyProfileService } from '../company-profile/company-profile.service';
import { FeatureService } from '../feature.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
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
      id: 1,
      name: 'Active',
    },
    {
      id: 2,
      name: 'Inactive',
    },
    {
      id: 3,
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

  constructor(
    private featureService: FeatureService,
    private dataService: DataService,
    private router: Router,
    private cService: CompanyProfileService
  ) {
    this.resetFilter();
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.loading = true;
    this.getSupplyChains();
  }

  resetFilter(): void {
    this.appliedFilters = {
      status: '',
      limit: 10,
      offset: 0,
      searchString: '',
      selectedSupplyChain: '',
      selectedCountry: '',
      sortBy: 'date',
      orderBy: 'desc',
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

    this.loadCompanies();
  }

  filterClicked(): void {
    this.toggleFilter = !this.toggleFilter;
    if (!this.toggleFilter) {
      this.resetFilter();
      this.loadCompanies();
    }
  }

  viewDetails(id: string): void {
    this.router.navigateByUrl('/company-profile/' + id);
  }

  inviteCompany(data?: string): void {
    this.invite = !this.invite;
    if (data && data === 'reload') {
      this.toggleFilter = false;
      this.resetFilter();
      this.loadCompanies();
    } else {
      this.toggleFilter = false;
      this.resetFilter();
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
  }
}
