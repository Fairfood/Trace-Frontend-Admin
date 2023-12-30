import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

// other modules
import { CompanyRoutingModule } from './product-routing.module';
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { SearchBoxModule } from 'src/app/shared-modules/search-box/search-box.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { FairFoodDropdownModule } from 'src/app/shared-modules/ff-dropdown/ff-dropdown.module';
import { FairFoodInputModule } from 'src/app/shared-modules/ff-input/ff-input.module';
// component
import { ProductComponent } from './product.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';

@NgModule({
  declarations: [ProductComponent, ProductCreateComponent],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    FfPaginationModule,
    MatIconModule,
    SearchBoxModule,
    LoaderModule,
    FairFoodDropdownModule,
    MatMenuModule,
    FairFoodInputModule,
    MatDialogModule,
    ButtonsComponent,
  ],
})
export class ProductModule {}
