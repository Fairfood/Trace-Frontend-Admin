import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { FarmerProfileRoutingModule } from './farmer-profile-routing.module';

import { FfPaginationModule } from 'src/app/shared/components/ff-pagination/ff-pagination.module';

// component
import { FarmerProfileComponent } from './farmer-profile.component';
import { IncomeComponent } from './income/income.component';
import { ActivityComponent } from './activity/activity.component';
import { ListDetailComponent } from 'src/app/shared/components/list-detail';
import { FarmComponent } from './farm/farm.component';
import {
  FairFoodCustomTabComponent,
  LoaderComponent,
  FfCustomPaginationComponent,
} from 'fairfood-utils';
import { ExportIconComponent } from 'src/app/shared/components/export-icon';
import { SearchBoxComponent } from 'src/app/shared/components/search-box';
import { ProfileAvatarComponent } from 'src/app/shared/components/profile-avatar';
import { GoogleMapsModule } from '@angular/google-maps';
@NgModule({
  declarations: [
    FarmerProfileComponent,
    IncomeComponent,
    ActivityComponent,
    FarmComponent,
  ],
  imports: [
    CommonModule,
    FarmerProfileRoutingModule,
    FairFoodCustomTabComponent,
    MatIconModule,
    ProfileAvatarComponent,
    FfPaginationModule,
    SearchBoxComponent,
    ExportIconComponent,
    ListDetailComponent,
    LoaderComponent,
    GoogleMapsModule,
    FfCustomPaginationComponent,
  ],
})
export class FarmerProfileModule {}
