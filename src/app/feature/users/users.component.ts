/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

// services and configs
import {
  USERS_COLUMNS,
  SEARCHBY_OPTIONS,
  TableColumnHeader,
} from 'src/app/core/utils/app.constants';
import { DataService } from 'src/app/core/data.service';
import { UsersService } from './users.service';
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnDestroy, OnInit {
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: TableColumnHeader[] = USERS_COLUMNS;
  totalCount: any;
  appliedFilters: any;
  loading = true;
  searchBy: any[] = SEARCHBY_OPTIONS;

  constructor(
    private userService: UsersService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
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
      .subscribe(
        result => {
          const { results, count } = result;
          this.totalCount = count;
          this.dataSource = results;
          this.loading = false;
        },
        () => {
          this.dataSource = [];
          this.loading = false;
        }
      );
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
