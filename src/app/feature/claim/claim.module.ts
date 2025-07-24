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

// component
import { ClaimComponent } from './claim.component';
import { CreateClaimComponent } from './create-claim/create-claim.component';
import { EditClaimComponent } from './edit-claim/edit-claim.component';

import { SearchBoxComponent } from 'src/app/shared/components/search-box';
import { FairFoodDropdownComponent } from 'src/app/shared/components/ff-dropdown';
import {
  ButtonsComponent,
  FairFoodCustomTabComponent,
  FfPaginationComponent,
  LoaderComponent,
  FfCustomPaginationComponent,
} from 'fairfood-utils';
import { FairFoodInputComponent } from 'fairfood-form-components';
@NgModule({
  declarations: [ClaimComponent, CreateClaimComponent, EditClaimComponent],
  imports: [
    CommonModule,
    ClaimRoutingModule,
    MatIconModule,
    SearchBoxComponent,
    FfPaginationComponent,
    FairFoodCustomTabComponent,
    FairFoodInputComponent,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    ButtonsComponent,
    LoaderComponent,
    FairFoodDropdownComponent,
    FfCustomPaginationComponent,
  ],
})
export class ClaimModule {}
