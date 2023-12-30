import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  token: string;
  salt: string;
  type: number;
  userId: string;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.userId = this.route.snapshot.queryParamMap.get('user');
    this.salt = this.route.snapshot.queryParamMap.get('salt');
    this.type = +this.route.snapshot.queryParamMap.get('type');
    const user = localStorage.getItem('isFairfoodAdminLoggedin');
    if (this.token && this.salt) {
      if (user) {
        this.openLogoutDialog();
      } else {
        this.logoutAndRedirect();
      }
    } else {
      if (user) {
        this.router.navigateByUrl('/dashboard');
      }
    }
  }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      disableClose: true,
      width: '500px',
      height: '200px',
      panelClass: 'custom-modalbox',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        localStorage.clear();
        this.logoutAndRedirect();
      } else {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  logoutAndRedirect(): void {
    window.location.href = `${environment.authUrl}/logout-and-redirect?user=${this.userId}&token=${this.token}&salt=${this.salt}&type=${this.type}`;
  }
}
