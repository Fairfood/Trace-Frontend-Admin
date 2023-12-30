import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { FairFoodDropdownModule } from '../shared-modules/ff-dropdown/ff-dropdown.module';
import { DownloadsModule } from '../shared-modules/downloads/downloads.module';

import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatMenuModule,
    FairFoodDropdownModule,
    DownloadsModule,
  ],
  exports: [HeaderComponent],
})
export class CoreModule {}
