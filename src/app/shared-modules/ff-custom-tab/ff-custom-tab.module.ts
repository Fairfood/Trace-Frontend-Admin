import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// material
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
// component
import { FairFoodCustomTabComponent } from './ff-custom-tab.component';

@NgModule({
  declarations: [FairFoodCustomTabComponent],
  imports: [CommonModule, MatIconModule, MatMenuModule, MatCheckboxModule],
  exports: [FairFoodCustomTabComponent],
})
export class FairFoodCustomTabModule {}
