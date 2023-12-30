import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// material
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
// components
import { FareFoodDropdownComponent } from './ff-dropdown.component';
import { FfDropMenuComponent } from './ff-drop-menu/ff-drop-menu.component';
import { FilterDropdownPipe } from './ff-dropdown.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ButtonsComponent } from '../buttons/buttons.component';

const componets = [
  FareFoodDropdownComponent,
  FilterDropdownPipe,
  FfDropMenuComponent,
];

@NgModule({
  declarations: [...componets],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatRadioModule,
    MatIconModule,
    ButtonsComponent,
    MatCheckboxModule,
  ],
  exports: [...componets],
})
export class FairFoodDropdownModule {}
