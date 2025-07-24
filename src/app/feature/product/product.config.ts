import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FfFilterBoxWrapperComponent } from 'fairfood-form-components';
import {
  ButtonsComponent,
  FfPaginationComponent,
  LoaderComponent,
  FfCustomPaginationComponent,
} from 'fairfood-utils';
import { SearchBoxComponent } from 'src/app/shared/components/search-box';
import { ProductCreateComponent } from '../product-create';
import { MatDialogModule } from '@angular/material/dialog';

export const IMPORTS = [
  NgIf,
  NgFor,
  ButtonsComponent,
  FfFilterBoxWrapperComponent,
  MatIconModule,
  FfPaginationComponent,
  MatMenuModule,
  SearchBoxComponent,
  LoaderComponent,
  ProductCreateComponent,
  MatDialogModule,
  FfCustomPaginationComponent,
];
