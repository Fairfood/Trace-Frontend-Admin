import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard, IsLoggedIn } from './shared/guards';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feature').then(m => m.features),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./feature/login/login.module').then(m => m.LoginModule),
    canActivate: [IsLoggedIn],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
