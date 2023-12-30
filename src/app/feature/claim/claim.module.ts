import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// material
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

// other custom modules
import { ClaimRoutingModule } from './claim-routing.module';
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { SearchBoxModule } from 'src/app/shared-modules/search-box/search-box.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { FairFoodCustomTabModule } from 'src/app/shared-modules/ff-custom-tab/ff-custom-tab.module';
import { FairFoodInputModule } from 'src/app/shared-modules/ff-input/ff-input.module';
import { FairFoodDropdownModule } from 'src/app/shared-modules/ff-dropdown/ff-dropdown.module';
// component
import { ClaimComponent } from './claim.component';
import { CreateClaimComponent } from './create-claim/create-claim.component';
import { EditClaimComponent } from './edit-claim/edit-claim.component';
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';
@NgModule({
  declarations: [ClaimComponent, CreateClaimComponent, EditClaimComponent],
  imports: [
    CommonModule,
    ClaimRoutingModule,
    FfPaginationModule,
    MatIconModule,
    SearchBoxModule,
    LoaderModule,
    FairFoodCustomTabModule,
    FairFoodInputModule,
    ReactiveFormsModule,
    FairFoodDropdownModule,
    FormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    ButtonsComponent,
  ],
})
export class ClaimModule {}
