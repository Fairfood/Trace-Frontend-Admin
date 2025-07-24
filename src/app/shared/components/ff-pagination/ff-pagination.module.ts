import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfPaginationComponent } from './ff-pagination.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FfPaginationComponent],
  imports: [CommonModule, MatMenuModule, MatPaginatorModule, MatIconModule],
  exports: [FfPaginationComponent],
})
export class FfPaginationModule {}
