import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

// custom modules
import { FfPaginationModule } from 'src/app/shared-modules/ff-pagination/ff-pagination.module';
import { SearchBoxModule } from 'src/app/shared-modules/search-box/search-box.module';
import { LoaderModule } from 'src/app/shared-modules/loader/loader.module';
import { UsersRoutingModule } from './users-routing.module';
import { FairFoodInputModule } from 'src/app/shared-modules/ff-input/ff-input.module';
import { FairFoodDropdownModule } from 'src/app/shared-modules/ff-dropdown/ff-dropdown.module';
// components
import { UsersComponent } from './users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ButtonsComponent } from 'src/app/shared-modules/buttons/buttons.component';

@NgModule({
  declarations: [UsersComponent, CreateUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FfPaginationModule,
    MatIconModule,
    SearchBoxModule,
    ButtonsComponent,
    LoaderModule,
    MatDialogModule,
    FairFoodInputModule,
    ReactiveFormsModule,
    FormsModule,
    FairFoodDropdownModule,
  ],
})
export class UsersModule {}
