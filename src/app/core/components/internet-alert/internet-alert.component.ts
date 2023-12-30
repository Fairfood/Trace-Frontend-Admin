import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
@Component({
  selector: 'app-internet-alert',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, SnackBarComponent],
  template: ``,
  styles: [],
})
export class InternetAlertComponent {
  constructor(private snackBar: MatSnackBar) {}
  @HostListener('window:offline')
  onOffline() {
    this.noInternetSnackBar();
  }

  @HostListener('window:online')
  onOnline() {
    this.onlineAlert();
  }

  noInternetSnackBar() {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'Network Error! Check your Internet Connection',
        icon: 'Error',
      },
      panelClass: 'snackbar-color',
      duration: 3000,
    });
  }

  onlineAlert() {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        message: 'You are back online',
        icon: 'Success',
      },
      panelClass: 'snackbar-color',
      duration: 3000,
    });
  }
}
