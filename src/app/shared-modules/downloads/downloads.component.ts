/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { map, mapTo, scan, takeWhile, startWith } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { MatMenuTrigger } from '@angular/material/menu';
// services and configs
import { DataService } from '../../core/data.service';
import { ACTION_TYPE } from '../../core/utils/app.constants';

enum EXPORT_STATUS {
  PENDING = 'PEND',
  COMPLETED = 'DONE',
  REVOKED = 'RVKD',
  FAILED = 'FAIL',
}

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
})
export class DownloadsComponent implements OnInit, OnDestroy {
  @ViewChild('languageMenuTrigger') languageMenuTrigger: MatMenuTrigger;
  readonly exportStatus = EXPORT_STATUS;
  pageApis: Subscription[] = [];
  recentExports: any[] = [];
  loading = true;
  subscription: Subscription;
  currentDownloadId: string;
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const sub = this.dataService.hasExportStarted().subscribe((result: any) => {
      this.exportData(result);
    });
    this.pageApis.push(sub);
    this.reportDownloadListing();
  }

  exportData(incomingData: any): void {
    const api = this.dataService.createExport(incomingData).subscribe(res => {
      this.recentExports.unshift({
        ...res,
        status: 'preparing',
      });
      const downloadId = res?.id;
      setTimeout(() => {
        this.exportDataPing(downloadId, res.etc);
      }, 3000);
      this.openMenu();
    });
    this.pageApis.push(api);
  }

  reportDownloadListing(): void {
    const api = this.dataService.reportListing().subscribe((res: any) => {
      this.recentExports = res.slice(0, 3);
      this.recentExports = this.recentExports.map((item: any) => {
        if (item.status === EXPORT_STATUS.PENDING) {
          item.progress = this.setPending(item.id, item.etc);
        }
        return {
          ...item,
        };
      });

      this.loading = false;
    });
    this.pageApis.push(api);
  }

  setPending(downloadId: string, etc: number): void {
    const index = this.recentExports.findIndex((s: any) => s.id === downloadId);
    if (index > -1) {
      this.recentExports[index].status = EXPORT_STATUS.PENDING;
      const duration = (etc / 10) * 1000;
      this.recentExports[index].progress = this.autoIncrementVar(duration);
    }
  }

  autoIncrementVar(duration: number): Observable<number> {
    const progress = interval(duration).pipe(
      startWith(0),
      mapTo(10),
      scan((a, b) => a + b),
      takeWhile(value => value < 100, true),
      map(value => (value === 100 ? 100 : value))
    );

    return progress;
  }

  exportDataPing(id: string, etc?: number): void {
    const api = this.dataService.pingAPI(id).subscribe(res => {
      const allowedStatus = [
        EXPORT_STATUS.COMPLETED,
        EXPORT_STATUS.FAILED,
        EXPORT_STATUS.REVOKED,
      ];
      if (allowedStatus.includes(res.status)) {
        this.recentExports = this.recentExports.map(item => {
          if (item.id === id) {
            return {
              ...res,
              status: res.status,
            };
          }
          return item;
        });
      } else {
        if (etc) {
          this.setPending(id, etc);
          setTimeout(() => {
            this.exportDataPing(id);
          }, (etc - 2) * 1000);
        } else {
          setTimeout(() => {
            this.exportDataPing(id);
          }, 5 * 1000);
        }
      }
    });
    this.pageApis.push(api);
  }

  exportFn(index: number, item: any): any {
    return item.id;
  }

  downloadFile(listItem: any): void {
    const api = this.dataService
      .downloadReceipt(listItem.file)
      .subscribe((result: any) => {
        saveAs(result, listItem?.file_name);
      });
    this.pageApis.push(api);
  }

  cancelExport(id: string): void {
    const api = this.dataService.cancelExport(id).subscribe(
      (res: any) => {
        if (res) {
          this.loading = true;
          this.reportDownloadListing();
        }
      },
      (err: any) => {
        if (err.status === 400) {
          this.dataService.customSnackBar(
            'File already generated. Cannot cancel',
            ACTION_TYPE.FAILED
          );
        }
      }
    );
    this.pageApis.push(api);
  }

  openMenu(): void {
    this.languageMenuTrigger.openMenu();
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
