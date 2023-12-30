import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// material
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
// modules
import { CompanyRoutingModule } from './company-routing.module';
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { SearchBoxModule } from 'src/app/shared-modules/search-box/search-box.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { FairFoodDropdownModule } from 'src/app/shared-modules/ff-dropdown/ff-dropdown.module';
import { FairFoodCustomTabModule } from 'src/app/shared-modules/ff-custom-tab/ff-custom-tab.module';
import { FairFoodInputModule } from 'src/app/shared-modules/ff-input/ff-input.module';
import { SortCustomModule } from 'src/app/shared-modules/sort-custom/sort-custom.module';
import { ExportIconModule } from 'src/app/shared-modules/export-icon/export-icon.module';
// components
import { CompanyComponent } from './company.component';
import { InviteCompanyComponent } from './invite-company/invite-company.component';
// stand alone components
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';
import { ChartLineComponent } from 'src/app/shared-modules/chart-line/chart-line.component';

@NgModule({
  declarations: [CompanyComponent, InviteCompanyComponent],
  imports: [
    CommonModule,
    FfPaginationModule,
    CompanyRoutingModule,
    SearchBoxModule,
    MatIconModule,
    LoaderModule,
    FairFoodDropdownModule,
    MatMenuModule,
    FairFoodCustomTabModule,
    FairFoodInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    SortCustomModule,
    ExportIconModule,
    ChartLineComponent,
    ButtonsComponent,
  ],
})
export class CompanyModule {}
