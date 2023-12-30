import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { TransactionRoutingModule } from './transaction-routing.module';
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { SearchBoxModule } from 'src/app/shared-modules/search-box/search-box.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { FairFoodDropdownModule } from 'src/app/shared-modules/ff-dropdown/ff-dropdown.module';
import { SortCustomModule } from 'src/app/shared-modules/sort-custom/sort-custom.module';
import { ExportIconModule } from 'src/app/shared-modules/export-icon/export-icon.module';

import { TransactionComponent } from './transaction.component';
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';
import { ChartLineComponent } from 'src/app/shared-modules/chart-line/chart-line.component';

@NgModule({
  declarations: [TransactionComponent],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    FfPaginationModule,
    SearchBoxModule,
    MatIconModule,
    LoaderModule,
    FairFoodDropdownModule,
    SortCustomModule,
    ExportIconModule,
    ButtonsComponent,
    ChartLineComponent,
  ],
})
export class TransactionModule {}
