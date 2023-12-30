/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent {
  collapedSideBar: boolean;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.collapedSideBar = false;

    const clearStorage =
      this.route.snapshot.queryParamMap.get('isClearStorage');

    if (clearStorage) {
      localStorage.removeItem('viewingAsAdmin');
      const item = localStorage.getItem('redirectUrl');
      localStorage.removeItem('redirectUrl');
      this.router.navigateByUrl(item);
    }
    const item = localStorage.getItem('viewingAsAdmin');
    if (item && JSON.parse(item) === true) {
      window.location.href = environment.traceUrl;
    }
  }

  receiveCollapsed($event: any) {
    this.collapedSideBar = $event;
  }
}
