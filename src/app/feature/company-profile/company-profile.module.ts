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
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';
// other modules
import { CompanyProfileRoutingModule } from './company-profile-routing.module';
import { FairFoodCustomTabModule } from 'src/app/shared-modules/ff-custom-tab/ff-custom-tab.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { FairFoodDropdownModule } from 'src/app/shared-modules/ff-dropdown/ff-dropdown.module';
import { ProfileAvatarModule } from 'src/app/shared-modules/profile-avatar/profile-avatar.module';

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
    FairFoodCustomTabModule,
    LoaderModule,
    FfPaginationModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    FairFoodDropdownModule,
    ProfileAvatarModule,
    ButtonsComponent,
  ],
})
export class CompanyProfileModule {}
