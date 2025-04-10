/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

// services and configs
import {
  USERS_COLUMNS,
  SEARCHBY_OPTIONS,
  TableColumnHeader,
} from 'src/app/shared/configs/app.constants';
import { DataService } from 'src/app/shared/services/data.service';
import { UsersService } from './users.service';
import { USER_COMP_IMPORTS } from './users.config';
import { CreateUserComponent } from '../create-user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: USER_COMP_IMPORTS,
})
export class UsersComponent implements OnDestroy, OnInit {
  private readonly userService = inject(UsersService);
  private readonly dataService = inject(DataService);
  private readonly dialog = inject(MatDialog);

  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: TableColumnHeader[] = USERS_COLUMNS;
  totalCount: any;
  appliedFilters: any;
  loading = true;
  searchBy: any[] = SEARCHBY_OPTIONS;

  constructor() {
    this.appliedFilters = {
      status: '',
      limit: 10,
      offset: 0,
      searchString: '',
      type: '',
    };
  }

  ngOnInit(): void {
    this.dataService.hideSupplyChain.next('hide');
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userList();
  }

  userList(): void {
    this.dataSource = [];
    const api = this.userService
      .getAdminUserList(this.appliedFilters)
      .subscribe({
        next: result => {
          const { results, count } = result;
          this.totalCount = count;
          this.dataSource = results;
          this.loading = false;
        },
        error: () => {
          this.dataSource = [];
          this.loading = false;
        },
      });
    this.pageApis.push(api);
  }

  paginatorEvent(data: any): void {
    const { limit, offset } = data;
    this.appliedFilters.limit = limit;
    this.appliedFilters.offset = offset;
    this.loadUsers();
  }

  searchFilter(data: any): void {
    this.appliedFilters.searchString = data;
    this.appliedFilters.limit = 10;
    this.appliedFilters.offset = 0;
    this.loadUsers();
  }

  addNewUser(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '600px',
      height: 'auto',
      panelClass: 'custom-modalbox',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  ngOnDestroy(): void {
    this.pageApis?.forEach(a => a.unsubscribe());
  }
}
