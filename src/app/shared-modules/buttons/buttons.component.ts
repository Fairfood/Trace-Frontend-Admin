import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
  standalone: true,
  imports: [CommonModule, MatMenuModule],
})
export class ButtonsComponent {
  @Input() buttonType: 'fill' | 'stroked' | 'secondary';
  @Input() buttonSize: 'medium' | 'large';
  @Input() buttonClass: string;
  @Input() isDisabled: boolean;
  @Input() tooltip: string;

  @Output() buttonClicked = new EventEmitter();

  buttonClick(): void {
    this.buttonClicked.emit(true);
  }
}
