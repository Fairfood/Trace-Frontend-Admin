/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

const imagePathPrefix = '../../../assets/images/';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
  standalone: true,
  imports: [MatSnackBarModule, CommonModule],
})
export class SnackBarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  get getClass(): string {
    if (this.data.icon === 'Error') {
      return 'fonterror';
    } else {
      return 'fontsucces';
    }
  }

  get getIcon(): string {
    if (['Success', 'Error', 'Delete'].includes(this.data.icon)) {
      return `${imagePathPrefix}${this.data.icon.toLowerCase()}.svg`;
    } else {
      return `${imagePathPrefix}success.svg`;
    }
  }
}
