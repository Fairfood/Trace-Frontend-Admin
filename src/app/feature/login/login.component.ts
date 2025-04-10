/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../shared/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  invalid = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData: any;
  pageApis: Subscription[] = [];
  isMagicLinkLogin: boolean;
  errorMessage: string;
  deviceId: string;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _authService: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const userId = this.route.snapshot.queryParamMap.get('user');
    const salt = this.route.snapshot.queryParamMap.get('salt');
    const type = this.route.snapshot.queryParamMap.get('type');
    if (token && salt && userId) {
      this.isMagicLinkLogin = true;
      this.deviceId = userId + new Date().valueOf();
      const data: any = {
        validation_token: token,
        user_id: userId,
        device_id: this.deviceId,
        type,
        salt,
      };
      this.magicLinkLogin(data);
    } else {
      this.isMagicLinkLogin = false;
      this.errorMessage = this.translate.instant('loaderText.invalidRequest');
      window.location.href = environment.authUrl;
    }
  }

  magicLinkLogin(data: any): void {
    const api = this._authService.magicLogin(data).subscribe(
      (res: any) => {
        const { data } = res;
        this.setUserData(data);
      },
      (err: any) => {
        console.log(err);
        this.isMagicLinkLogin = false;
        this.errorMessage = this.translate.instant(
          'loaderText.somethingWentWrong'
        );
        setTimeout(() => {
          window.location.href = environment.authUrl + '/logout';
        }, 2000);
      }
    );
    this.pageApis.push(api);
  }

  // Function to store values to localstorage
  setUserData(val: any): void {
    localStorage.setItem('isFairfoodAdminLoggedin', 'true');
    localStorage.setItem('adminData', JSON.stringify(val));
    localStorage.setItem('deviceId', this.deviceId);
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a?.unsubscribe());
  }
}
