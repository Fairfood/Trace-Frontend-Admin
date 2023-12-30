import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { CompanyComponent } from './company.component';
import { InviteCompanyComponent } from './invite-company/invite-company.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
  },
  {
    path: '/invite',
    component: InviteCompanyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
