/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// services and config/constants
import {
  COMPANY_COLUMNS,
  FARMER_COLUMNS,
  TableColumnHeader,
  TRANSACTION_COLUMNS,
} from 'src/app/core/utils/app.constants';
import { nFormatter } from 'src/app/core/utils/app.config';
// services
import { FeatureService } from '../feature.service';
import { DataService } from 'src/app/core/data.service';
import { Router } from '@angular/router';

interface InnerItem {
  title: number;
  value: string;
}
interface Statistics {
  actors: InnerItem;
  companies: InnerItem;
  totalQuantity: InnerItem;
  farmers: InnerItem;
  products: InnerItem;
  supplyChains: InnerItem;
  transactions: InnerItem;
}

interface Context {
  heading: string;
  subHeading: string;
  text: string;
  routerUrl: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  recentlyAddedCompanies: any[] = [];
  recentlyAddedFarmers: any[] = [];
  recentTransactions: any[] = [];
  pageApis: Subscription[] = [];
  companyHeading: TableColumnHeader[];
  farmerHeading: TableColumnHeader[] = FARMER_COLUMNS;
  transactionHeading: TableColumnHeader[] = TRANSACTION_COLUMNS;
  loaderValue: number;

  companyContext: Context = {
    heading: 'Recently added companies',
    subHeading: 'Recently created',
    text: 'View all companies',
    routerUrl: '/company',
  };
  farmerContext: Context = {
    heading: 'Recently added farmers',
    subHeading: 'Recently joined',
    text: 'View all farmers',
    routerUrl: '/farmers',
  };
  transactionContext: Context = {
    heading: 'Recent transactions',
    subHeading: 'External transactions',
    text: 'View all transactions',
    routerUrl: '/transactions',
  };
  mapDefaultOptions = {
    mapTypeControl: false,
    fullscreenControl: false,
    minZoom: 2,
    maxZoom: 8,
    options: {
      gestureHandling: 'greedy',
    },
    center: { lat: -25.363, lng: 131.044 },
  };
  mapActorTypes = ['All', 'Farmer', 'Company'];
  googleMapObj: any;
  statisticsData: Statistics;
  selectedChain = '';

  constructor(
    private featureService: FeatureService,
    private dataService: DataService,
    private router: Router
  ) {
    this.companyHeading = COMPANY_COLUMNS.slice(0, -1);
  }

  ngOnInit(): void {
    const supplyChainChanges =
      this.dataService.supplyChainDataChanged.subscribe(
        (result: { type: string; value: any }) => {
          if (result) {
            const { type, value } = result;
            if (type === 'supplyChain') {
              this.selectedChain = value;
              this.initApiCalls();
            }
          }
        }
      );
    this.pageApis.push(supplyChainChanges);
    this.dataService.hideSupplyChain.next('show');
    this.initApiCalls();
  }

  /**
   * Init the api calls
   */
  initApiCalls(): void {
    this.homeStatistics();
    // for table listing incremental loader
    this.loaderValue = 1;
    // first api call subsequent calls will be made
    // after result is arrived. Check recentfarmer method for the next api call
    this.recentFarmers();
  }

  /**
   * Statistics like actor count farmer count etcc....
   */
  homeStatistics(): void {
    const api = this.featureService
      .statisticsData(this.selectedChain)
      .subscribe({
        next: result => {
          const {
            actors,
            companies,
            farmer_transaction_quantity,
            products,
            supply_chains,
            transactions,
            farmers,
          } = result;

          this.statisticsData = {
            actors: {
              title: actors,
              value: nFormatter(actors),
            },
            companies: {
              title: companies,
              value: nFormatter(companies),
            },
            totalQuantity: {
              title: Math.floor(farmer_transaction_quantity),
              value: nFormatter(Math.floor(farmer_transaction_quantity)),
            },
            products: {
              title: products,
              value: nFormatter(products),
            },
            supplyChains: {
              title: supply_chains,
              value: nFormatter(supply_chains),
            },
            transactions: {
              title: transactions,
              value: nFormatter(transactions),
            },
            farmers: {
              title: farmers,
              value: nFormatter(farmers),
            },
          };
        },
        error: () => {
          this.statisticsData = null;
        },
      });
    this.pageApis.push(api);
  }

  /**
   * API to get the recently added farmers - tabular data
   */
  recentFarmers(): void {
    const api = this.featureService
      .getFarmersList({
        selectedSupplyChain: '',
        limit: 5,
        offset: 0,
        searchString: '',
        selectedCountry: '',
        sortBy: 'created_on',
        orderBy: 'desc',
      })
      .subscribe({
        next: result => {
          const { results } = result;
          this.recentlyAddedFarmers = results;
          this.loaderValue = 2;
          this.recentCompanies();
        },
        error: () => {
          this.recentlyAddedFarmers = [];
          this.loaderValue = 2;
          this.recentCompanies();
        },
      });
    this.pageApis.push(api);
  }

  /**
   * API to get the recently added company data - table
   */
  recentCompanies(): void {
    const api = this.featureService
      .getCompanyList({
        selectedSupplyChain: '',
        limit: 5,
        offset: 0,
        searchString: '',
        status: '',
        selectedCountry: '',
        sortBy: 'created_on',
        orderBy: 'desc',
      })
      .subscribe({
        next: result => {
          const { results } = result;
          this.recentlyAddedCompanies = results;
          this.loaderValue = 3;
          this.transactionList();
        },
        error: () => {
          this.recentlyAddedCompanies = [];
          this.loaderValue = 3;
          this.transactionList();
        },
      });
    this.pageApis.push(api);
  }

  /**
   * Table - recent transactions
   */
  transactionList(): void {
    const api = this.featureService
      .getTransactionList({
        limit: 5,
        offset: 0,
        searchString: '',
        selectedSupplyChain: '',
        sortBy: 'date',
        orderBy: 'desc',
      })
      .subscribe({
        next: result => {
          const { results } = result;
          this.recentTransactions = results;
          this.loaderValue = 4;
        },
        error: () => {
          this.recentTransactions = [];
          this.loaderValue = 4;
        },
      });
    this.pageApis.push(api);
  }

  /**
   * View company details
   * @param id string
   */
  viewDetails(id: string): void {
    this.router.navigateByUrl('/company-profile/' + id);
  }

  /**
   * View farmer details
   * @param id string
   */
  viewFarmerDetails(id: string): void {
    this.router.navigateByUrl('/farmer-profile/' + id);
  }

  /**
   * unsubscribe all the api calls
   */
  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
