/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ff-pagination',
  templateUrl: './ff-pagination.component.html',
  styleUrls: ['./ff-pagination.component.scss'],
})
export class FfPaginationComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() totalCount: number;

  @Output() paginationAction = new EventEmitter();
  getPageSizeOptions(): number[] {
    if (this.totalCount > 20) {
      return [10, 20, 50];
    } else {
      return [10, 20];
    }
  }

  pageEvent(e: any): void {
    e.length = 10;
    this.paginator.pageSize = e.pageSize;
    this.paginationAction.emit({
      limit: this.paginator.pageSize,
      offset: this.paginator.pageIndex * this.paginator.pageSize,
    });
  }

  pageSizeSetter(pageSize: any): void {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = pageSize;
    this.paginationAction.emit({
      limit: this.paginator.pageSize,
      offset: 0,
    });
  }
}
