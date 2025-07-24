import { NgFor, NgIf } from '@angular/common';
import {
  ButtonsComponent,
  FfPaginationComponent,
  LoaderComponent,
  FfCustomPaginationComponent,
} from 'fairfood-utils';
import { SearchBoxComponent } from 'src/app/shared/components/search-box';
import { CreateUserComponent } from '../create-user';
import { MatDialogModule } from '@angular/material/dialog';

export const USER_COMP_IMPORTS = [
  ButtonsComponent,
  SearchBoxComponent,
  NgIf,
  NgFor,
  FfPaginationComponent,
  CreateUserComponent,
  LoaderComponent,
  MatDialogModule,
  FfCustomPaginationComponent,
];
