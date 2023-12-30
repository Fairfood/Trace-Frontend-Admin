import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _translate: TranslateService) {
    this._translate.setDefaultLang('en');
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
