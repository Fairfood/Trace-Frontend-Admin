import { DatePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import {
  FfDropdownComponent,
  FfFilterBoxWrapperComponent,
} from 'fairfood-form-components';
import {
  ButtonsComponent,
  FfCustomPaginationComponent,
  FfPaginationComponent,
  LoaderComponent,
  SortCustomComponent,
} from 'fairfood-utils';
import { ExportIconComponent } from 'src/app/shared/components/export-icon';
import { TabItem } from 'src/app/shared/configs/app.constants';
import { InviteCompanyComponent } from '../invite-company';
import { MatIconModule } from '@angular/material/icon';
import { SearchBoxComponent } from 'src/app/shared/components/search-box';
import { ChartLineComponent } from 'src/app/shared/components/chart-line';

export const INVITE: TabItem[] = [
  {
    id: 'connection',
    name: 'Connection details',
    description: 'Connection summary',
    active: true,
  },
  {
    id: 'address',
    name: 'Address details',
    description: 'Address summary',
    active: false,
  },
];

export const COMPANY_ADDRESS = [
  {
    key: 'street',
    label: 'Street name *',
    controlName: 'street',
    type: 'text',
  },
  {
    key: 'city',
    label: 'City/Village *',
    controlName: 'city',
    type: 'text',
  },
  {
    key: 'country',
    label: 'Country *',
    controlName: 'country',
    type: 'dropdown',
    defaultValue: 'country',
  },
  {
    key: 'province',
    label: 'Province *',
    controlName: 'province',
    type: 'dropdown',
    defaultValue: 'province',
  },
  {
    key: 'zipcode',
    label: 'Postal code',
    controlName: 'zipcode',
    type: 'text',
  },
];

export const IMPORTS_COMPANY = [
  NgIf,
  NgFor,
  MatMenuModule,
  SortCustomComponent,
  FfPaginationComponent,
  ExportIconComponent,
  InviteCompanyComponent,
  LoaderComponent,
  DatePipe,
  ButtonsComponent,
  MatIconModule,
  SearchBoxComponent,
  ChartLineComponent,
  NgTemplateOutlet,
  FfFilterBoxWrapperComponent,
  FfCustomPaginationComponent,
];
