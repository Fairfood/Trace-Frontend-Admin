/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth/auth.service';
import { SidebarItem, SIDEBAR_ITEMS } from './sidebar.config';

// modules
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
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

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.addExpandClass('requests');
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  onLoggedout() {
    this._authService.logout();
  }
}
