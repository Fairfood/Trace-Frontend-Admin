import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
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
  }
}
