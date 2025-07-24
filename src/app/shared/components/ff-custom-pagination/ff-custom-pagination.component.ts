import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CustomPaginatorComponent } from '../custom-paginator/custom-paginator.component';

export interface Paginator {
  limit: number;
  offset: number;
  type?: 'perPage' | 'page';
}

@Component({
  selector: 'app-ff-custom-pagination',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    CustomPaginatorComponent,
  ],
  templateUrl: './ff-custom-pagination.component.html',
  styleUrls: ['./ff-custom-pagination.component.scss'],
})
export class FfCustompaginationComponent implements OnChanges {
  @Input() totalCount: number;
  @Input() customPage?: Partial<Paginator>;
  @Input() hidePageSize = false;
  @Input() defaultPageSize = 10;

  totalPages: string;
  currentStartIndex = 1;
  currentEndIndex = 10;
  enteredPageNo: number;
  isLoading = true;
  pageSize: number = this.defaultPageSize;
  pageIndex = 0;

  @Output() paginationAction = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    const { customPageSize } = changes;
    if (customPageSize?.currentValue) {
      this.pageSize = customPageSize.currentValue.limit;
      this.pageIndex = customPageSize.currentValue.offset;
    }
    if (this.customPage) {
      this.pageSize = this.customPage.limit;
      if (this.customPage.offset) {
        this.pageIndex = this.customPage.offset / this.pageSize;
      }
    }
    this.updatePaginationDetails();
  }

  getPageSizeOptions(): number[] {
    if (this.totalCount > 20) {
      return [10, 20, 50];
    } else {
      return [10, 20];
    }
  }

  pageEvent(e: any): void {
    console.log(e, 'E');

    if (!e || typeof e !== 'object') {
      console.error('Invalid page event:', e);
      return;
    }

    this.pageSize = e.pageSize || this.defaultPageSize;
    this.pageIndex = e.pageIndex || 0;
    this.updatePaginationDetails();
    console.log(this.customPage.offset, this.pageIndex * this.pageSize, 'PP');

    this.paginationAction.emit({
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize,
      type: 'page',
    });
  }

  pageSizeSetter(pageSize: number): void {
    this.pageIndex = 0;
    this.pageSize = pageSize;
    this.updatePaginationDetails();
    this.paginationAction.emit({
      limit: this.pageSize,
      offset: 0,
      type: 'perPage',
    });
  }

  updatePaginationDetails(pageIndex?: number, pageSize?: number): void {
    const effectivePageSize = pageSize || this.pageSize;
    const effectivePageIndex =
      pageIndex !== undefined ? pageIndex : this.pageIndex;

    this.currentStartIndex = effectivePageIndex * effectivePageSize + 1;
    this.currentEndIndex = Math.min(
      this.currentStartIndex + effectivePageSize - 1,
      this.totalCount
    );

    const totalPageCount = Math.ceil(this.totalCount / effectivePageSize);
    const currentPage = effectivePageIndex + 1;
    this.totalPages = `${currentPage}/${totalPageCount}`;

    if (totalPageCount) {
      this.isLoading = false;
    }
    this.enteredPageNo = null;
  }

  jumpToPage(pageNo: any): void {
    const parsedPageNo = parseFloat(pageNo);
    const totalPageCount = Math.ceil(this.totalCount / this.pageSize);

    if (
      pageNo < 1 ||
      pageNo > totalPageCount ||
      isNaN(parsedPageNo) ||
      !Number.isInteger(parsedPageNo)
    ) {
      this.enteredPageNo = null;
      return;
    }
    this.pageIndex = pageNo - 1;

    this.paginationAction.emit({
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize,
      type: 'page',
    });

    this.updatePaginationDetails(this.pageIndex, this.pageSize);
  }
}
