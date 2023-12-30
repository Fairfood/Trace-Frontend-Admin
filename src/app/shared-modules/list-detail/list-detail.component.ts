import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IList } from 'src/app/core/utils/app.constants';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss'],
})
export class ListDetailComponent {
  @Input() iterationList: IList[];
  @Input() activeItem?: number;
  @Input() showAddButton?: boolean;
  @Input() addButtonText?: string;

  @Output() listClicked = new EventEmitter();
  @Output() buttonPressed = new EventEmitter();

  itemClicked(item: IList, index: number): void {
    this.listClicked.emit({ item, index });
  }

  buttonClicked(): void {
    this.buttonPressed.emit(true);
  }
}
