import {
  DatePipe,
  NgFor,
  NgIf,
  NgTemplateOutlet,
  SlicePipe,
} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ChartLineComponent } from 'src/app/shared/components/chart-line/chart-line.component';
import {
  ButtonsComponent,
  FfPaginationComponent,
  LoaderComponent,
  SortCustomComponent,
  FfCustomPaginationComponent,
} from 'fairfood-utils';
import { ExportIconComponent } from 'src/app/shared/components/export-icon';
import { SearchBoxComponent } from 'src/app/shared/components/search-box';
import { FfFilterBoxWrapperComponent } from 'fairfood-form-components';

export const CONFIG = [
  NgIf,
  NgFor,
  NgTemplateOutlet,
  DatePipe,
  SlicePipe,
  SearchBoxComponent,
  MatIconModule,
  SortCustomComponent,
  ExportIconComponent,
  ButtonsComponent,
  ChartLineComponent,
  LoaderComponent,
  FfPaginationComponent,
  FfFilterBoxWrapperComponent,
  FfCustomPaginationComponent,
];
