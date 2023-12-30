import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeatureComponent } from './feature.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'company',
        loadChildren: () =>
          import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'supply-chain',
        loadChildren: () =>
          import('./supply-chain/supply-chain.module').then(
            m => m.SupplyChainModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'claims',
        loadChildren: () =>
          import('./claim/claim.module').then(m => m.ClaimModule),
      },
      {
        path: 'farmers',
        loadChildren: () =>
          import('./farmer/farmer.module').then(m => m.FarmerModule),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./transaction/transaction.module').then(
            m => m.TransactionModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'company-profile/:id',
        loadChildren: () =>
          import('./company-profile/company-profile.module').then(
            m => m.CompanyProfileModule
          ),
      },
      {
        path: 'farmer-profile/:id',
        loadChildren: () =>
          import('./farmer-profile/farmer-profile.module').then(
            m => m.FarmerProfileModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
