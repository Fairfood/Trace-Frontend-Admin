/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { NgClass, Location, NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { environment } from 'src/environments/environment';
// components
import { InternetAlertComponent } from '../shared/components/internet-alert';
import { SidebarComponent } from '../shared/components/sidebar';
import { HeaderComponent } from '../shared/components/header';
import { LoaderComponent } from 'fairfood-utils';

import { IdTokenRequest } from '../shared/configs/app.models';
import { AuthService, StorageService } from '../shared/services';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
  standalone: true,
  imports: [
    InternetAlertComponent,
    SidebarComponent,
    HeaderComponent,
    RouterModule,
    NgClass,
    NgIf,
    LoaderComponent,
  ],
})
export class FeatureComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly storageService = inject(StorageService);

  private destroy$ = new Subject<void>();

  collapedSideBar: boolean;
  canLoadHeader = false;

  constructor() {
    this.collapedSideBar = false;
  }

  ngOnInit(): void {
    // new workflow
    /**
     * Checking if code exists in the query params.
     * If it exists, it means the user is trying to login.
     * If it doesn't exist, it means the user is already logged in.
     */
    const code = this.route.snapshot.queryParamMap.get('code');
    const loggedIn = localStorage.getItem('isFairfoodAdminLoggedin');

    if (code && !loggedIn) {
      this.getIdToken(code);
    } else {
      this.checkIfLoggedIn();
    }
  }

  checkIfLoggedIn(): void {
    const loggedIn = this.storageService.retrieveStoredData(
      'isFairfoodAdminLoggedin'
    );
    if (!loggedIn) {
      window.location.href = environment.authenticateUrl;
    } else {
      this.location.go('/dashboard');
      this.checkIfClearStorage();
    }
  }

  checkIfClearStorage(): void {
    const clearStorage =
      this.route.snapshot.queryParamMap.get('isClearStorage');
    if (clearStorage) {
      localStorage.removeItem('viewingAsAdmin');
      const item = this.storageService.retrieveStoredData('redirectUrl');
      localStorage.removeItem('redirectUrl');
      this.canLoadHeader = true;
      this.router.navigateByUrl(item);
    } else {
      this.checkForImpersonate();
    }
  }

  getIdToken(code: string): void {
    const reqObject: IdTokenRequest = {
      code,
      grant_type: 'authorization_code',
      redirect_uri: window.location.origin + '/',
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
    };
    this.auth
      .getIdToken(reqObject)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        const { access_token, id_token, refresh_token } = res;
        this.auth.setUserData({
          access_token,
          id_token,
          refresh_token,
        });
        this.getUserDetails();
      });
  }

  checkForImpersonate(): void {
    const item = this.storageService.retrieveStoredData('viewingAsAdmin');
    if (item && JSON.parse(item) === true) {
      window.location.href = environment.traceUrl;
    } else {
      this.canLoadHeader = true;
    }
  }

  receiveCollapsed($event: any): void {
    this.collapedSideBar = $event;
  }

  getUserDetails(): void {
    this.auth
      .fetchSsoUserDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.storageService.saveInStorage(
            'adminData',
            JSON.stringify(response)
          );
          this.storageService.saveInStorage('userId', response.id);
          // change url without reloading
          this.location.go('/dashboard');
          this.canLoadHeader = true;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
