import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

// other modules
import { CompanyRoutingModule } from './product-routing.module';
import { FfPaginationModule } from 'src/app/shared/components/ff-pagination/ff-pagination.module';

// component
import { ProductComponent } from './product.component';
import { ProductCreateComponent } from '../product-create/product-create.component';
import { ButtonsComponent, LoaderComponent } from 'fairfood-utils';
import { SearchBoxComponent } from 'src/app/shared/components/search-box';
import {
  FairFoodInputComponent,
  FfDropdownComponent,
} from 'fairfood-form-components';

@NgModule({
  declarations: [ProductComponent, ProductCreateComponent],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    FfPaginationModule,
    MatIconModule,
    SearchBoxComponent,
    FfDropdownComponent,
    MatMenuModule,
    FairFoodInputComponent,
    MatDialogModule,
    ButtonsComponent,
    LoaderComponent,
  ],
})
export class ProductModule {}
