/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FfDropMenuComponent } from '../ff-drop-menu';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Duplicate of dropdown in the library
 * Specially for admin app
 */
@Component({
  selector: 'app-ff-dropdown',
  templateUrl: './ff-dropdown.component.html',
  styleUrls: ['./ff-dropdown.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FfDropMenuComponent,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
  ],
})
export class FairFoodDropdownComponent implements OnChanges {
  selectedValue: any;
  dropDownValues: any[] = [];

  @Input() label: string;
  @Input() dropdownOptions: any;

  @Input() defaultValue: any;
  @Input() hideSearch: boolean;
  @Input() size: string;
  @Input() clearButtonText: string;
  @Input() multiple: boolean;
  @Input() hideClear: boolean;
  @Output() newSelectionValue = new EventEmitter();

  @ViewChild(MatMenuTrigger) dropdownMenuItem: MatMenuTrigger;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['dropdownOptions']) {
      this.dropDownValues = changes['dropdownOptions']?.currentValue;
      this.preselectValue();
    }
  }

  preselectValue(): void {
    if (this.multiple) {
      if (this.defaultValue) {
        const result = JSON.parse(JSON.stringify(this.defaultValue));
        // Name should be shown instead of id
        this.selectedValue = result?.map((m: any) => m.name);
      }
    } else {
      setTimeout(() => {
        // since single selection is radio button: finding the id from options and assigning to selected value
        if (this.defaultValue) {
          if (this.defaultValue === 'All') {
            this.selectedValue = { id: 'All', name: 'selectedValue.all' };
          } else {
            const found = this.dropDownValues.find(
              p => p.id === this.defaultValue
            );
            this.selectedValue = found;
          }
        } else {
          // default
          this.selectedValue = { id: 'All', name: 'selectedValue.selectHere' };
        }
      }, 100);
    }
  }

  menuItemSelected(selected: any): void {
    if (this.multiple) {
      if (selected?.length > 0) {
        this.selectedValue = selected?.map((m: any) => m.name);
        this.newSelectionValue.emit(selected);
      } else {
        this.selectedValue = [];
        this.defaultValue = [];
        this.newSelectionValue.emit([]);
      }
    } else {
      if (selected.id === 'All') {
        if (this.clearButtonText) {
          this.selectedValue = { id: 'All', name: 'All' };
        } else {
          this.selectedValue = { id: 'All', name: 'Select here' };
        }
      } else {
        this.selectedValue = selected;
      }
      this.newSelectionValue.emit(this.selectedValue);
    }

    this.dropdownMenuItem.closeMenu();
  }
}
