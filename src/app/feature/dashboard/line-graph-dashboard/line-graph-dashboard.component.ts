/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data.service';
import { HeaderFilter } from 'src/app/core/utils/app.constants';
// services and config
import { YearObj, YEAR_DROPDOWN } from '../dashboard.config';
import { DashboardService } from '../dashboard.service';

// this component holds the two graphs in dashboard
@Component({
  selector: 'app-line-graph-dashboard',
  templateUrl: './line-graph-dashboard.component.html',
  styleUrls: ['./line-graph-dashboard.component.scss'],
})
export class LineGraphDashboardComponent implements OnInit, OnDestroy {
  // actor report graph
  actorData: any[];
  formattedChart: any[];
  actorReportLoader = true;
  actorFilters: any;

  // farmer transacation graph
  farmerTransactionData: any[] = [];
  farmerLoader = true;
  farmerFilters: any;
  // common for the graphs
  yearDropDown = YEAR_DROPDOWN;
  currentProducts: any[] = [];

  pageApis: Subscription[] = [];
  actorColors: string[] = ['#5691AE', '#003A60'];
  selectedSupplyChain = '';

  constructor(
    private dashboardService: DashboardService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const supplyChainChanges =
      this.dataService.supplyChainDataChanged.subscribe(
        (result: HeaderFilter) => {
          if (result) {
            const { type, value } = result;
            if (type === 'supplyChain') {
              this.selectedSupplyChain = value;
              this.initApiCalls();
            } else if (type === 'commodity') {
              this.actorReportLoader = true;
              this.actorFilters.currentProduct = value;
              this.actorReportData(this.actorFilters.currentYearFilter);

              this.farmerLoader = true;
              this.farmerFilters.currentProduct = value;
              if (this.farmerFilters.innerFilter === 'Transactions') {
                this.getfarmerTransactionData();
              } else {
                this.farmerTransactionQuantityData();
              }
            } else {
              this.actorFilters.currentYearFilter = value;
              this.actorReportData(value);
              this.farmerFilters.currentYearFilter = value;
              if (this.farmerFilters.innerFilter === 'Transactions') {
                this.getfarmerTransactionData();
              } else {
                this.farmerTransactionQuantityData();
              }
            }
          }
        }
      );
    this.pageApis.push(supplyChainChanges);
    this.initApiCalls();
  }

  /**
   * Init the api calls
   * First reset the filter and set the loader to true
   */
  initApiCalls(): void {
    this.resetFilter();
    this.actorReportLoader = true;
    this.farmerLoader = true;
    // graph data 1 ini api
    this.actorReportData(YEAR_DROPDOWN[1], true);
  }

  /**
   * reset the filter
   */
  resetFilter(): void {
    this.actorFilters = {
      currentProduct: '',
      currentYearFilter: YEAR_DROPDOWN[1],
      currentActorType: 'All',
      actorTypes: ['All', 'Farmer', 'Company'],
    };
    this.farmerFilters = {
      currentProduct: '',
      currentYearFilter: YEAR_DROPDOWN[1],
      innerFilter: 'Transactions',
      filterItems: ['Transactions', 'Quantity'],
    };
  }

  /**
   * First graph data actor (farmer and company) report
   * How many actors created in each month
   *
   * @param yearObj YearObj
   */
  actorReportData(yearObj: YearObj, nextApi?: boolean): void {
    const { startDate, endDate } = yearObj;
    const api = this.dashboardService
      .actorReportData(
        'month',
        startDate,
        endDate,
        this.actorFilters.currentProduct,
        this.selectedSupplyChain
      )
      .subscribe(result => {
        if (result.length) {
          this.actorData = this.dashboardService.formatActorsGraphData(
            result,
            this.actorFilters.currentYearFilter
          );
        } else {
          this.actorData = [];
        }
        this.actorColors = ['#5691AE', '#003A60'];
        this.formattedChart = this.actorData;
        this.actorFilters.currentActorType = 'All';
        this.actorReportLoader = false;
        if (nextApi) {
          // graph data 2 init api
          this.getfarmerTransactionData();
        }
      });
    this.pageApis.push(api);
  }

  /**
   * How much transactions are done (farmer transactions)
   */
  getfarmerTransactionData(): void {
    const { startDate, endDate } = this.farmerFilters.currentYearFilter;
    const api = this.dashboardService
      .actorTransactionReportData(
        'month',
        startDate,
        endDate,
        this.farmerFilters.currentProduct,
        this.selectedSupplyChain
      )
      .subscribe(result => {
        if (result.length) {
          this.farmerTransactionData =
            this.dashboardService.formatTransactionData(
              result,
              'count',
              this.farmerFilters.currentYearFilter
            );
        } else {
          this.farmerTransactionData = [];
        }
        this.farmerLoader = false;
      });
    this.pageApis.push(api);
  }

  /**
   * How much quantity done
   */
  farmerTransactionQuantityData(): void {
    const { startDate, endDate } = this.farmerFilters.currentYearFilter;
    const api = this.dashboardService
      .farmerQuantityReportData(
        'month',
        startDate,
        endDate,
        this.farmerFilters.currentProduct,
        this.selectedSupplyChain
      )
      .subscribe(result => {
        if (result.length) {
          this.farmerTransactionData =
            this.dashboardService.formatTransactionData(
              result,
              'total_quantity',
              this.farmerFilters.currentYearFilter
            );
        } else {
          this.farmerTransactionData = [];
        }
        this.farmerLoader = false;
      });
    this.pageApis.push(api);
  }

  /**
   * Common method to handle the graph year filter
   * @param type string
   * @param yearObj YearObj
   */
  yearFilterCommon(type: string, yearObj: YearObj): void {
    if (type === 'actor') {
      this.actorFilters.currentYearFilter = yearObj;
      this.actorReportData(yearObj);
    } else {
      this.farmerFilters.currentYearFilter = yearObj;
      if (this.farmerFilters.innerFilter === 'Transactions') {
        this.getfarmerTransactionData();
      } else {
        this.farmerTransactionQuantityData();
      }
    }
  }

  /**
   * Graph 1 inner filter (ALL, company or farmer)
   * Changing chart data series
   * @param data string
   */
  changeActor(data: string): void {
    this.actorReportLoader = true;
    this.actorFilters.currentActorType = data;
    if (data === 'Farmer') {
      this.formattedChart = [this.actorData[0]];
      this.actorColors = ['#5691AE'];
    } else if (data === 'Company') {
      this.formattedChart = [this.actorData[1]];
      this.actorColors = ['#003A60'];
    } else {
      // actorData contains whole data
      this.formattedChart = this.actorData;
      this.actorColors = ['#5691AE', '#003A60'];
    }
    this.actorReportLoader = false;
  }

  /**
   * inner filter of graph 2
   * @param data string
   */
  changeTransaction(data: string): void {
    this.farmerLoader = true;
    this.farmerFilters.innerFilter = data;

    if (data === 'Transactions') {
      this.getfarmerTransactionData();
    } else {
      this.farmerTransactionQuantityData();
    }
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
