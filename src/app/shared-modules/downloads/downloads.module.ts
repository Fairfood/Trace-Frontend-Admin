import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// material
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// components
import { DownloadsComponent } from './downloads.component';

@NgModule({
  declarations: [DownloadsComponent],
  imports: [CommonModule, MatMenuModule, MatProgressBarModule],
  exports: [DownloadsComponent],
})
export class DownloadsModule {}
