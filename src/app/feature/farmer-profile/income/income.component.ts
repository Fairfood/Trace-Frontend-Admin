/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { MatPaginator } from '@angular/material/paginator';

import { IReference, PAYMENTS_COLUMNS } from '../farmer-profile.config';
import { FarmerProfileService } from '../farmer-profile.service';
import { DataService } from 'src/app/core/data.service';
import {
  ACTION_TYPE,
  exportFileType,
  exportType,
} from 'src/app/core/utils/app.constants';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent implements OnInit, OnDestroy {
  @Input() farmerId: string;
  @Input() farmerData: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: any;
  displayedColumns = PAYMENTS_COLUMNS;
  pageApis: Subscription[] = [];
  tableCount: number;
  incomeData: IReference = {
    count: 0,
    loading: true,
    results: [],
  };

  optionsArray = [
    {
      id: 'name',
      name: 'Source',
    },
  ];

  downloadingId: string;

  constructor(
    private service: FarmerProfileService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getFarmerPaymentData();
  }

  getFarmerPaymentData(search = '', limit = 10, offset = 0): void {
    const api = this.service
      .getFarmerPayments(this.farmerId, search, limit, offset)
      .subscribe({
        next: res => {
          const { results, count } = res;
          this.tableCount = count;
          this.dataSource = results;

          this.incomeData = res;
        },
        error: () => {
          this.incomeData = {
            count: 0,
            loading: false,
            results: [],
          };
        },
      });
    this.pageApis.push(api);
  }

  initExport(): void {
    const params = {
      farmer: this.farmerData.id,
    };
    this.dataService.initExportData({
      export_type: exportType.INCOME,
      filters: JSON.stringify(params),
      file_type: exportFileType.EXCEL,
    });
  }

  searchFilter(data: string) {
    this.getFarmerPaymentData(data);
  }

  /**
   * Downloading transaction receipt
   */
  downloadFile(element: any): void {
    if (!this.downloadingId) {
      this.downloadingId = element.id;
      const api = this.dataService
        .downloadReceipt(element.invoice)
        .subscribe((result: any) => {
          saveAs(result, element.invoice?.split('/').pop());
          this.downloadingId = '';
        });
      this.pageApis.push(api);
    } else {
      this.dataService.customSnackBar(
        'Download in progress. Please try again after some time !',
        ACTION_TYPE.FAILED
      );
    }
  }

  paginatorEvent(data: any): void {
    const { limit, offset } = data;
    this.getFarmerPaymentData('', limit, offset);
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
