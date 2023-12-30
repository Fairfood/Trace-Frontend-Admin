/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  TableColumnHeader,
  USERS_COLUMNS,
} from 'src/app/core/utils/app.constants';
import { CompanyProfileService } from '../company-profile.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
  dataSource: any;
  pageApis: Subscription[] = [];
  displayedColumns: TableColumnHeader[] = USERS_COLUMNS;
  totalCount: any;
  filters: any = {
    limit: 10,
    offset: 0,
  };
  loading = true;

  constructor(private cService: CompanyProfileService) {}

  ngOnInit(): void {
    this.teamMemberData();
  }

  teamMemberData(): void {
    const { limit, offset } = this.filters;
    this.dataSource = [];
    const api = this.cService
      .listTeamOfCompany(this.companyId, offset, limit)
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
    this.filters.limit = limit;
    this.filters.offset = offset;
    this.loading = true;
    this.teamMemberData();
  }

  ngOnDestroy(): void {
    this.pageApis.map(m => m.unsubscribe());
  }
}
