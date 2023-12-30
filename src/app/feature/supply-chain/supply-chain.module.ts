import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// material
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
// other modules
import { SupplyChainRoutingModule } from './supply-chain-routing.module';
import { SearchBoxModule } from 'src/app/shared-modules/search-box/search-box.module';
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { FairFoodInputModule } from 'src/app/shared-modules/ff-input/ff-input.module';
// components
import { SupplyChainComponent } from './supply-chain.component';
import { CreateSupplyChainComponent } from './create-supply-chain/create-supply-chain.component';
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';
@NgModule({
  declarations: [SupplyChainComponent, CreateSupplyChainComponent],
  imports: [
    CommonModule,
    SupplyChainRoutingModule,
    FfPaginationModule,
    SearchBoxModule,
    ButtonsComponent,
    MatIconModule,
    LoaderModule,
    MatDialogModule,
    FairFoodInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
  ],
})
export class SupplyChainModule {}
