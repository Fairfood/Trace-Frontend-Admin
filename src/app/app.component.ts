import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  readonly authService = inject(AuthService);
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    localStorage.setItem('langId', 'en');
  }

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener('storage', (event: any) => {
      if (event.storageArea === localStorage && event.key === null) {
        const token = localStorage.getItem('isFairfoodAdminLoggedin');
        if (!token) {
          // Refresh after 4 second
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        }
      }
    });
    setInterval(() => {
      this.checkUserLoginStatus();
    }, 5000);
  }

  isUserLoggedIn(): boolean {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'isFairfoodUserLoggedIn' && value) {
        return true;
      }
    }
    return false;
  }

  // Handle logout if user logs out from the first app
  checkUserLoginStatus(): void {
    if (!this.isUserLoggedIn()) {
      this.authService.logoutWithoutApi();
    }
  }
}
