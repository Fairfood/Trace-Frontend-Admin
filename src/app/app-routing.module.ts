import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './authentication/services/guard/auth.guard';
import { IsLoggedIn } from './authentication/services/guard/isLoggedIn';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature/feature.module').then(m => m.FeatureModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./authentication/login/login.module').then(m => m.LoginModule),
    canActivate: [IsLoggedIn],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
