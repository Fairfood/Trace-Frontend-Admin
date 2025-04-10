import { Routes } from '@angular/router';
import { FeatureComponent } from './feature.component';

export const features: Routes = [
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
        loadComponent: () => import('./company').then(c => c.CompanyComponent),
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
        loadComponent: () => import('./product').then(p => p.ProductComponent),
      },
      {
        path: 'claims',
        loadChildren: () =>
          import('./claim/claim.module').then(m => m.ClaimModule),
      },
      {
        path: 'farmers',
        loadComponent: () => import('./farmer').then(f => f.FarmerComponent),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./transaction').then(t => t.TransactionComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./users').then(u => u.UsersComponent),
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
