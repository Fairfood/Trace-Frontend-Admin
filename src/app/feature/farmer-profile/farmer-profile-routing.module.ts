import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FarmerProfileComponent } from './farmer-profile.component';

const routes: Routes = [{ path: '', component: FarmerProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmerProfileRoutingModule {}
