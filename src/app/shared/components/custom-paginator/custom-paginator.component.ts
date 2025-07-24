import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss'],
})
export class CustomPaginatorComponent implements OnChanges {
  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<any>(); // Emits the new page data

  totalPages = 1;
  previousPageIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateTotalPages();
  }

  /**
   * Calculate total pages based on totalCount and pageSize.
   */
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
  }

  /**
   * Navigate to the previous page.
   */
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      const event = this.createPageEvent(this.currentPage - 2);
      this.previousPageIndex = this.currentPage - 1;
      this.currentPage--;
      this.pageChange.emit(event);
    }
  }

  /**
   * Navigate to the next page.
   */
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      const event = this.createPageEvent(this.currentPage);
      this.previousPageIndex = this.currentPage - 1;
      this.currentPage++;
      this.pageChange.emit(event);
    }
  }

  /**
   * Create the structured page event object.
   */
  private createPageEvent(pageIndex: number): any {
    return {
      previousPageIndex: this.previousPageIndex,
      pageIndex: pageIndex,
      pageSize: this.pageSize,
      length: this.totalCount,
    };
  }
}
