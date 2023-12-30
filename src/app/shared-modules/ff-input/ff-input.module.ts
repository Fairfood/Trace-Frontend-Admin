import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FairFoodInputComponent } from './ff-input.component';

@NgModule({
  declarations: [FairFoodInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [FairFoodInputComponent],
})
export class FairFoodInputModule {}
