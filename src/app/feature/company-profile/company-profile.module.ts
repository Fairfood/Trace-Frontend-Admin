import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// material
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
// components
import { CompanyProfileComponent } from './company-profile.component';
import { TeamComponent } from './team/team.component';
import { ActiveSupplyChainComponent } from './active-supply-chain/active-supply-chain.component';
import { ActivitiesComponent } from './activities/activities.component';
import { AddSupplyChainComponent } from './add-supply-chain/add-supply-chain.component';
// other modules
import { CompanyProfileRoutingModule } from './company-profile-routing.module';

import { FfPaginationModule } from 'src/app/shared/components/ff-pagination/ff-pagination.module';

import {
  ButtonsComponent,
  FairFoodCustomTabComponent,
  LoaderComponent,
  FfCustomPaginationComponent,
} from 'fairfood-utils';
import { ProfileAvatarComponent } from 'src/app/shared/components/profile-avatar';
import { FfDropdownComponent } from 'fairfood-form-components';
import { SyncBtnComponent } from '../../shared/components/sync-btn/sync-btn.component';

@NgModule({
  declarations: [
    CompanyProfileComponent,
    TeamComponent,
    ActiveSupplyChainComponent,
    ActivitiesComponent,
    AddSupplyChainComponent,
  ],
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    MatIconModule,
    FairFoodCustomTabComponent,
    FfPaginationModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    FfDropdownComponent,
    ProfileAvatarComponent,
    ButtonsComponent,
    LoaderComponent,
    SyncBtnComponent,
    FfCustomPaginationComponent,
  ],
})
export class CompanyProfileModule {}
