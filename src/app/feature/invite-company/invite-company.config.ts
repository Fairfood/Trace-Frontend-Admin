import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FairFoodInputComponent,
  FfDropdownComponent,
} from 'fairfood-form-components';
import {
  ButtonsComponent,
  FairFoodCustomTabComponent,
  LoaderComponent,
} from 'fairfood-utils';

export const IMPORTS = [
  MatCheckboxModule,
  NgIf,
  NgFor,
  ReactiveFormsModule,
  FfDropdownComponent,
  ButtonsComponent,
  FairFoodInputComponent,
  LoaderComponent,
  NgTemplateOutlet,
  FairFoodCustomTabComponent,
];
