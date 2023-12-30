import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { FarmerProfileRoutingModule } from './farmer-profile-routing.module';
import { FairFoodCustomTabModule } from 'src/app/shared-modules/ff-custom-tab/ff-custom-tab.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { ProfileAvatarModule } from 'src/app/shared-modules/profile-avatar/profile-avatar.module';
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { SearchBoxModule } from 'src/app/shared-modules/search-box/search-box.module';
import { ExportIconModule } from 'src/app/shared-modules/export-icon/export-icon.module';
// component
import { FarmerProfileComponent } from './farmer-profile.component';
import { IncomeComponent } from './income/income.component';
import { ActivityComponent } from './activity/activity.component';
import { ListDetailComponent } from 'src/app/shared-modules/list-detail/list-detail.component';
import { FarmComponent } from './farm/farm.component';
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
    FairFoodCustomTabModule,
    MatIconModule,
    LoaderModule,
    ProfileAvatarModule,
    FfPaginationModule,
    SearchBoxModule,
    ExportIconModule,
    ListDetailComponent,
  ],
})
export class FarmerProfileModule {}
