/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsComponent, FilterDropdownPipe } from 'fairfood-utils';

@Component({
  selector: 'app-ff-drop-menu',
  templateUrl: './ff-drop-menu.component.html',
  styleUrls: ['./ff-drop-menu.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgFor,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    ButtonsComponent,
    FilterDropdownPipe,
    TranslateModule,
  ],
})
export class FfDropMenuComponent implements OnChanges {
  searchString: string;
  selectedValue: any;
  selectedItems: any[];
  selectedValues: any[];

  @Input() dropdownOptions: any[];
  // if dropdown options are less search not needed
  @Input() hideSearch: boolean;
  // using in mobile filter as well
  @Input() isMobile: boolean;
  // is multiple or not
  @Input() isMultiple: boolean;
  // for preselecting items
  @Input() defaultValue: any;

  @Input() clearButtonText: string;
  @Input() hideClear: boolean;

  @Output() newSelectionValue = new EventEmitter();

  constructor() {
    this.selectedItems = [];
    this.selectedValues = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { defaultValue } = changes;

    if (defaultValue?.currentValue) {
      if (this.isMultiple) {
        this.selectedItems = defaultValue?.currentValue.map((c: any) => c.id);
        this.selectedValues = defaultValue?.currentValue;
      } else {
        setTimeout(() => {
          this.selectedValue = defaultValue?.currentValue
            ? { id: defaultValue?.currentValue }
            : { id: 'All' };
        }, 100);
      }
    }
  }

  menuItemSelected(selected: any): void {
    this.searchString = '';
    if (!this.isMultiple) {
      setTimeout(() => {
        this.selectedValue = selected;
      }, 100);
      this.newSelectionValue.emit(selected);
    }
  }

  multipleSelection(row: any): void {
    const { id, name } = row;
    const exists = this.selectedItems?.includes(id);
    if (exists) {
      this.selectedItems = this.selectedItems?.filter(c => {
        return c !== id;
      });
      this.selectedValues = this.selectedValues?.filter(c => {
        return c.id !== id;
      });
    } else {
      this.selectedItems.push(id);
      this.selectedValues.push({
        id,
        name,
      });
    }
    this.newSelectionValue.emit(this.selectedValues);
  }

  clearItem(): void {
    if (this.isMultiple) {
      this.searchString = '';
      this.selectedValues = [];
      this.selectedItems = [];
      this.newSelectionValue.emit([]);
    } else {
      this.searchString = '';
      this.selectedValue = { id: 'All' };
      this.newSelectionValue.emit({ id: 'All' });
    }
  }
}
