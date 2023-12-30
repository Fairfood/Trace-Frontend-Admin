import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
// other module
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { FarmerRoutingModule } from './farmer-routing.module';
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { SearchBoxModule } from 'src/app/shared-modules/search-box/search-box.module';
import { FairFoodDropdownModule } from 'src/app/shared-modules/ff-dropdown/ff-dropdown.module';
import { ExportIconModule } from 'src/app/shared-modules/export-icon/export-icon.module';
import { SortCustomModule } from 'src/app/shared-modules/sort-custom/sort-custom.module';
// component
import { FarmerComponent } from './farmer.component';
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';
import { ChartLineComponent } from 'src/app/shared-modules/chart-line/chart-line.component';

@NgModule({
  declarations: [FarmerComponent],
  imports: [
    CommonModule,
    FarmerRoutingModule,
    FfPaginationModule,
    SearchBoxModule,
    MatIconModule,
    LoaderModule,
    FairFoodDropdownModule,
    SortCustomModule,
    ExportIconModule,
    ChartLineComponent,
    ButtonsComponent,
  ],
})
export class FarmerModule {}
