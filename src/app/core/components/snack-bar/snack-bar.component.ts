/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

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
    switch (this.data.icon) {
      case 'Success':
        return 'fontsucces';
      case 'Error':
        return 'fonterror';
      case 'Delete':
        return 'fontsucces';
      default:
        return 'fontsucces';
    }
  }

  get getIcon(): string {
    switch (this.data.icon) {
      case 'Success':
        return '../../../assets/images/success.svg';
      case 'Error':
        return '../../../assets/images/error.svg';
      case 'Delete':
        return '../../../assets/images/delete.svg';
      default:
        return '../../../assets/images/success.svg';
    }
  }
}
