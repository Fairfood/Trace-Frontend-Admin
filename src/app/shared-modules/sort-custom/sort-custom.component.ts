import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sort-custom',
  templateUrl: './sort-custom.component.html',
  styleUrls: ['./sort-custom.component.scss'],
})
export class SortCustomComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() filterValues: any;
  @Input() columnName: string;

  @Output() selectSortHeader = new EventEmitter();

  sortHeader(): void {
    this.selectSortHeader.emit();
  }
}
