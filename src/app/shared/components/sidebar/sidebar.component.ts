/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
// services
import { AuthService } from 'src/app/shared/services';
import { SidebarItem, SIDEBAR_ITEMS } from './sidebar.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterModule, NgFor, NgClass, MatIconModule, TranslateModule],
})
export class SidebarComponent implements OnInit {
  isActive = false;
  collapsed = false;
  showMenu = '';
  pushRightClass = '';

  @Output() collapsedEvent = new EventEmitter<boolean>();
  dataServiceSubscription: any;
  userData: any;
  Subscription: Subscription = new Subscription();
  profileType: any;
  verificationCount = 0;
  dataLoaded = false;

  sidebarMenu: SidebarItem[] = SIDEBAR_ITEMS;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.addExpandClass('requests');
  }

  addExpandClass(element: any): void {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  onLoggedout(): void {
    this.authService.logoutWithoutApi();
  }
}
