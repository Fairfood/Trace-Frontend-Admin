import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// material
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
// other modules
import { SupplyChainRoutingModule } from './supply-chain-routing.module';

import { FfPaginationModule } from 'src/app/shared/components/ff-pagination/ff-pagination.module';
// components
import { SupplyChainComponent } from './supply-chain.component';
import { CreateSupplyChainComponent } from './create-supply-chain/create-supply-chain.component';
import {
  ButtonsComponent,
  LoaderComponent,
  FfCustomPaginationComponent,
  SortCustomComponent,
} from 'fairfood-utils';
import { SearchBoxComponent } from 'src/app/shared/components/search-box';
import { FairFoodInputComponent } from 'fairfood-form-components';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [SupplyChainComponent, CreateSupplyChainComponent],
  imports: [
    CommonModule,
    SupplyChainRoutingModule,
    FfPaginationModule,
    SearchBoxComponent,
    ButtonsComponent,
    MatIconModule,
    MatDialogModule,
    FairFoodInputComponent,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    LoaderComponent,
    MatTooltipModule,
    FfCustomPaginationComponent,
    SortCustomComponent,
  ],
})
export class SupplyChainModule {}
