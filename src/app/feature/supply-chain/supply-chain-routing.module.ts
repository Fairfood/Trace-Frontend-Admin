import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplyChainComponent } from './supply-chain.component';

const routes: Routes = [
  {
    path: '',
    component: SupplyChainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplyChainRoutingModule {}
